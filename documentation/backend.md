# API Sentinel --- Backend Design

## 1. Backend Responsibilities

The backend has two major processes:

### API Server

Handles user-facing requests:

-   Authentication
-   Monitor CRUD
-   Dashboard queries
-   Incident queries
-   Notification settings
-   Public status page

### Monitoring Worker

Handles asynchronous jobs:

-   Execute target API checks
-   Measure latency
-   Validate responses
-   Persist results
-   Evaluate incidents
-   Trigger notifications

## 2. Suggested Directory Structure

``` text
server/
├── src/
│   ├── config/
│   │   ├── env.js
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimit.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── monitors/
│   │   ├── incidents/
│   │   ├── dashboard/
│   │   ├── notifications/
│   │   └── statusPages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
└── tests/
```

Worker:

``` text
worker/
├── src/
│   ├── jobs/
│   ├── services/
│   ├── monitoring/
│   ├── incident/
│   ├── notifications/
│   └── worker.js
└── tests/
```

## 3. REST API

### Authentication

``` text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Monitors

``` text
GET    /api/monitors
POST   /api/monitors
GET    /api/monitors/:id
PATCH  /api/monitors/:id
DELETE /api/monitors/:id
POST   /api/monitors/:id/pause
POST   /api/monitors/:id/resume
```

### Checks

``` text
GET /api/monitors/:id/checks
GET /api/monitors/:id/metrics
```

### Incidents

``` text
GET /api/incidents
GET /api/incidents/:id
```

### Dashboard

``` text
GET /api/dashboard/stats
```

### Public status

``` text
GET /api/status/:publicId
```

## 4. Monitor Schema

``` text
Monitor
├── _id
├── userId
├── name
├── url
├── method
├── headers (optional, carefully restricted)
├── body (optional)
├── intervalSeconds
├── timeoutMs
├── expectedStatus
├── expectedBodyRule (optional)
├── latencyThresholdMs
├── failureThreshold
├── active
├── status
├── createdAt
└── updatedAt
```

Sensitive request credentials should not be stored in plain text. If
authenticated monitoring is added, secrets must be encrypted or handled
through a secure secret mechanism.

## 5. Check Result Schema

``` text
CheckResult
├── _id
├── monitorId
├── checkedAt
├── success
├── statusCode
├── responseTimeMs
├── errorType
├── errorMessage
├── bodyValidationPassed
└── createdAt
```

Avoid storing complete response bodies by default because they may
contain sensitive data and can grow storage quickly.

## 6. Incident Schema

``` text
Incident
├── _id
├── monitorId
├── status
├── reason
├── failureCount
├── startedAt
├── resolvedAt
├── durationMs
├── createdAt
└── updatedAt
```

## 7. Worker Algorithm

Pseudo-flow:

``` text
process(job):
    monitor = loadMonitor(job.monitorId)

    if monitor does not exist:
        return

    if monitor.active is false:
        return

    validateTarget(monitor.url)

    result = executeHttpCheck(monitor)

    saveCheckResult(result)

    if result is successful:
        handleRecovery(monitor, result)
    else:
        handleFailure(monitor, result)
```

## 8. HTTP Check

The HTTP check should:

1.  Start high-resolution timer.
2.  Create an abort/timeout controller.
3.  Send request.
4.  Capture status.
5.  Measure latency.
6.  Validate expected status.
7.  Optionally validate response content.
8.  Categorize errors.
9.  Return a normalized result.

Example normalized result:

``` js
{
  success: false,
  statusCode: 500,
  responseTimeMs: 241,
  errorType: "HTTP_ERROR",
  errorMessage: "Expected 200, received 500"
}
```

## 9. Error Categories

Use predictable categories:

``` text
TIMEOUT
DNS_ERROR
CONNECTION_ERROR
HTTP_ERROR
TLS_ERROR
INVALID_RESPONSE
BODY_VALIDATION_ERROR
SSRF_BLOCKED
UNKNOWN
```

This makes analytics and debugging easier.

## 10. Incident Logic

Do not open an incident for a single transient failure.

Example:

``` text
failureThreshold = 3

Failure #1 → record only
Failure #2 → record only
Failure #3 → open incident
```

Recovery should also avoid flapping.

Recommended V1 policy:

``` text
Success #1 → mark recovery candidate
Success #2 → resolve incident
```

This can be simplified to immediate recovery initially and strengthened
later.

## 11. Job Scheduling

Each active monitor needs a recurring job.

Conceptually:

``` text
Monitor created
 ↓
Create recurring BullMQ job
 ↓
Worker executes job
 ↓
Job schedules next execution
```

When a monitor is paused or deleted, its scheduled job must also be
paused/removed.

## 12. Database Queries

Dashboard metrics can be calculated using MongoDB aggregation.

Examples:

-   Uptime percentage
-   Average response time
-   Number of failures
-   Incidents in a date range
-   Recent checks
-   P95 latency

For a portfolio implementation, calculate expensive historical metrics
over bounded time windows.

## 13. Backend Security

### Authentication

Use hashed passwords and secure HTTP-only cookies.

### Authorization

Every monitor query must be scoped to the authenticated user's ID.

Bad:

``` text
GET /monitors/:id
```

with only ID lookup.

Correct concept:

``` text
findOne({
  _id: monitorId,
  userId: authenticatedUserId
})
```

### SSRF

Before the worker makes a request:

-   Parse URL.
-   Allow only HTTP/HTTPS.
-   Reject localhost.
-   Reject loopback addresses.
-   Reject private RFC1918 ranges.
-   Reject link-local addresses.
-   Reject cloud metadata endpoints.
-   Resolve DNS safely and validate resolved IPs.
-   Prevent redirects from bypassing validation.

SSRF protection should be treated as a core backend requirement, not an
optional enhancement.

## 14. Testing

Backend tests should cover:

-   Registration
-   Login
-   Authorization
-   Monitor CRUD
-   URL validation
-   SSRF blocking
-   Timeout handling
-   HTTP error handling
-   Check persistence
-   Incident creation
-   Incident resolution
-   Job processing
