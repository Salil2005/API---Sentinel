# API Sentinel --- System Flow

## 1. Overall Flow

``` text
User
  ↓
React/Vercel
  ↓
Express API
  ↓
MongoDB
  ↓
Monitor configuration
  ↓
BullMQ/Redis
  ↓
Monitoring Worker
  ↓
Target API
  ↓
Check result
  ↓
MongoDB
  ↓
Incident engine
  ↓
Notification
  ↓
Dashboard
```

## 2. User Registration

``` text
User
 ↓
POST /auth/register
 ↓
Validate input
 ↓
Check existing email
 ↓
Hash password
 ↓
Create user
 ↓
Set authentication cookie
 ↓
Return user/session information
```

## 3. Create Monitor

``` text
Dashboard
 ↓
Add Monitor form
 ↓
Frontend validation
 ↓
POST /monitors
 ↓
Authenticate user
 ↓
Validate URL/configuration
 ↓
SSRF validation
 ↓
Save monitor
 ↓
Create/update scheduled monitoring job
 ↓
Return monitor
```

## 4. Monitoring Job

Example monitor:

``` text
URL: https://example.com/api/health
Method: GET
Interval: 5 minutes
Timeout: 5 seconds
Expected status: 200
Failure threshold: 3
```

Flow:

``` text
BullMQ
 ↓
Job becomes available
 ↓
Worker receives job
 ↓
Load monitor
 ↓
Verify monitor is active
 ↓
Validate target
 ↓
Start timer
 ↓
Send HTTP request
 ↓
Receive response or timeout
 ↓
Measure latency
 ↓
Validate status/body
 ↓
Create check result
 ↓
Persist result
 ↓
Update monitor state
 ↓
Evaluate incident state
```

## 5. Successful Check

``` text
Request
 ↓
HTTP 200
 ↓
Latency acceptable
 ↓
Body validation passes
 ↓
SUCCESS
 ↓
Save result
 ↓
If incident is open, apply recovery policy
```

## 6. Failed Check

``` text
Request
 ↓
500 / timeout / network error / validation failure
 ↓
FAILED CHECK
 ↓
Save result
 ↓
Increment failure state
 ↓
Threshold reached?
 ├── No → wait for next check
 └── Yes
       ↓
   Create incident
       ↓
   Send notification
```

## 7. Recovery

``` text
Open incident
 ↓
Successful check
 ↓
Recovery policy satisfied
 ↓
Resolve incident
 ↓
Calculate downtime
 ↓
Persist resolvedAt
 ↓
Send recovery notification
```

## 8. Incident State Machine

``` text
HEALTHY
   │
   │ failure threshold reached
   ▼
DOWN
   │
   │ successful recovery
   ▼
HEALTHY
```

Optional degraded state:

``` text
HEALTHY
   │
   │ latency threshold exceeded
   ▼
DEGRADED
   │
   ├── healthy → HEALTHY
   └── repeated hard failures → DOWN
```

## 9. Dashboard Flow

``` text
React
 ↓
GET /dashboard/stats
GET /monitors
GET /incidents
GET /checks
 ↓
TanStack Query
 ↓
Render cards/charts/tables
```

## 10. Public Status Page

``` text
Visitor
 ↓
GET /status/:publicId
 ↓
Backend loads public status configuration
 ↓
Return sanitized monitor status
 ↓
React renders read-only status page
```

Never expose:

-   Monitor credentials
-   Internal URLs
-   Request headers
-   Secrets
-   Private configuration

## 11. Local Test Flow

The project includes a `test-api` service:

``` text
test-api/
├── /healthy
├── /slow
├── /error
├── /timeout
└── /random
```

This allows the entire monitoring lifecycle to be tested locally.

Example:

``` text
/api/error
 ↓
500
 ↓
Worker detects failure
 ↓
3 failures
 ↓
Incident opened
 ↓
Change endpoint to 200
 ↓
Recovery detected
 ↓
Incident resolved
```
