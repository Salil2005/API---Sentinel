# API Sentinel --- Implementation Plan

## 1. Development Strategy

Build the project incrementally. Do not begin with the full distributed
architecture.

The recommended sequence is:

``` text
Foundation
 ↓
Authentication
 ↓
Monitor CRUD
 ↓
Test API
 ↓
Monitoring worker
 ↓
Incident engine
 ↓
Dashboard
 ↓
Notifications
 ↓
Status page
 ↓
Security hardening
 ↓
Testing
 ↓
Deployment
```

## Phase 0 --- Repository Setup

### Tasks

-   Create monorepo.
-   Configure npm workspaces if desired.
-   Create client/server/worker/test-api folders.
-   Add ESLint.
-   Add Prettier.
-   Add `.env.example`.
-   Add README.
-   Configure Git.

### Deliverable

Application starts locally with all services represented.

------------------------------------------------------------------------

## Phase 1 --- Backend Foundation

### Tasks

-   Initialize Express.
-   Add environment configuration.
-   Connect MongoDB.
-   Add global error handler.
-   Add request validation.
-   Add CORS.
-   Add Helmet.
-   Add rate limiting.
-   Create health endpoint.

### Deliverable

``` text
GET /api/health
```

returns a healthy backend response.

------------------------------------------------------------------------

## Phase 2 --- Authentication

### Tasks

-   User schema.
-   Registration endpoint.
-   Login endpoint.
-   Logout endpoint.
-   Current-user endpoint.
-   bcrypt password hashing.
-   HTTP-only cookie authentication.
-   Authentication middleware.
-   Authorization tests.

### Deliverable

A user can securely register, login, logout, and access protected
endpoints.

------------------------------------------------------------------------

## Phase 3 --- Monitor CRUD

### Tasks

-   Monitor schema.
-   Create monitor endpoint.
-   List monitors.
-   Get monitor.
-   Update monitor.
-   Delete monitor.
-   Pause/resume.
-   Validation.
-   Ownership checks.

### Deliverable

A user can fully manage monitors from Postman.

------------------------------------------------------------------------

## Phase 4 --- Local Test API

Build:

``` text
test-api/
├── /healthy
├── /slow
├── /error
├── /timeout
└── /random
```

### Tasks

-   Create Express test server.
-   Implement controlled response delays.
-   Implement controlled 500 errors.
-   Implement timeout behavior.
-   Implement random failures.

### Deliverable

You can simulate all important monitoring scenarios locally.

------------------------------------------------------------------------

## Phase 5 --- Basic Monitoring Worker

Initially implement a worker without advanced scheduling.

### Tasks

-   Worker process.
-   Load monitor.
-   Execute HTTP request.
-   Timeout handling.
-   Measure latency.
-   Capture status.
-   Save check result.

### Deliverable

Run one monitoring job manually and confirm a result appears in MongoDB.

------------------------------------------------------------------------

## Phase 6 --- Redis + BullMQ

### Tasks

-   Connect Redis.
-   Create monitoring queue.
-   Create worker consumer.
-   Add recurring jobs.
-   Add retry configuration.
-   Add job logging.
-   Pause/remove jobs when monitors change.

### Deliverable

Monitors are checked automatically according to their schedule.

------------------------------------------------------------------------

## Phase 7 --- Incident Engine

### Tasks

-   Track consecutive failures.
-   Create incident after threshold.
-   Prevent duplicate incidents.
-   Track reason.
-   Detect recovery.
-   Resolve incident.
-   Calculate downtime.

### Deliverable

Complete lifecycle:

``` text
Healthy
 ↓
Failure
 ↓
Failure
 ↓
Failure
 ↓
Incident Open
 ↓
Recovery
 ↓
Incident Resolved
```

------------------------------------------------------------------------

## Phase 8 --- Response Validation

### Tasks

Add:

-   Expected HTTP status.
-   Optional latency threshold.
-   Optional response-body validation.
-   Error classification.

### Deliverable

The system can distinguish:

``` text
HTTP success
HTTP failure
Timeout
Slow response
Unexpected response
```

------------------------------------------------------------------------

## Phase 9 --- Frontend Foundation

### Tasks

-   React/Vite setup.
-   Tailwind.
-   Router.
-   API client.
-   Authentication screens.
-   Layout.
-   Navigation.
-   Protected routes.

### Deliverable

User can login and reach a dashboard.

------------------------------------------------------------------------

## Phase 10 --- Dashboard

### Tasks

Create:

-   Summary cards.
-   Monitor table.
-   Status indicators.
-   Monitor detail page.
-   Recent checks.
-   Latency chart.
-   Incident list.

### Deliverable

User can understand API health without using Postman.

------------------------------------------------------------------------

## Phase 11 --- Notifications

### Tasks

-   Notification configuration.
-   Email/webhook service.
-   Incident-open event.
-   Incident-resolved event.
-   Retry failed notifications.
-   Prevent notification spam.

### Deliverable

A failed API generates a useful notification.

------------------------------------------------------------------------

## Phase 12 --- Public Status Page

### Tasks

-   Status page schema.
-   Public identifier.
-   Publish/unpublish.
-   Public API endpoint.
-   Sanitized monitor information.
-   Public frontend page.

### Deliverable

A shareable read-only system status page.

------------------------------------------------------------------------

## Phase 13 --- Security Hardening

### Priority: Critical

Implement SSRF protection before exposing monitoring to other users.

### Tasks

-   URL parsing.
-   HTTP/HTTPS restriction.
-   Localhost blocking.
-   Private IP blocking.
-   Loopback blocking.
-   Link-local blocking.
-   Metadata endpoint blocking.
-   DNS resolution checks.
-   Redirect validation.
-   Request size limits.
-   Rate limiting.

### Deliverable

Malicious monitoring targets are rejected.

------------------------------------------------------------------------

## Phase 14 --- Data Retention and Optimization

### Tasks

-   Add indexes.
-   Limit historical queries.
-   Add retention policy for check results.
-   Aggregate metrics efficiently.
-   Avoid storing unnecessary response bodies.

### Deliverable

Database usage remains manageable on a free-tier deployment.

------------------------------------------------------------------------

## Phase 15 --- Testing

### Unit tests

Test:

-   URL validation
-   SSRF validation
-   status evaluation
-   latency evaluation
-   incident state transitions
-   recovery logic

### Integration tests

Test:

``` text
Create monitor
 ↓
Run worker
 ↓
Store check
 ↓
Create incident
 ↓
Recover
 ↓
Resolve incident
```

### Security tests

Test attempts against:

``` text
localhost
127.0.0.1
private IP
link-local IP
metadata endpoint
redirect to private IP
```

------------------------------------------------------------------------

## Phase 16 --- Docker Development

Create Docker configuration for:

``` text
MongoDB
Redis
Server
Worker
Test API
```

The frontend can run separately during development.

### Deliverable

A new developer can start the backend infrastructure with one command.

------------------------------------------------------------------------

## Phase 17 --- Deployment

### Frontend

Deploy client to Vercel.

### Backend

Deploy server to Render.

### Worker

Deploy worker separately if the available Render plan supports it.

### Database

Use MongoDB Atlas.

### Redis

Use a suitable free-tier Redis service available at deployment time.

### Deployment checks

Verify:

-   HTTPS
-   CORS
-   Cookies
-   Environment variables
-   MongoDB connectivity
-   Redis connectivity
-   Worker execution
-   Notifications
-   Public status page

------------------------------------------------------------------------

## Phase 18 --- Portfolio Polish

### README

Include:

-   Problem
-   Solution
-   Architecture
-   Tech stack
-   Screenshots
-   Local setup
-   Deployment
-   Security decisions
-   API documentation
-   Testing strategy

### Demo

Prepare this scenario:

``` text
1. Create monitor
2. Show healthy API
3. Trigger 500 error
4. Show failed checks
5. Show incident creation
6. Show notification
7. Restore API
8. Show incident resolution
9. Show latency/history chart
10. Show public status page
```

## 19. Recommended Build Order

If working alone, use this exact priority:

``` text
MVP
────────────────────────
1. Express server
2. MongoDB
3. Authentication
4. Monitor CRUD
5. Test API
6. Worker
7. HTTP checking
8. Check results
9. Incident detection
10. Basic dashboard

V1
────────────────────────
11. Redis
12. BullMQ scheduling
13. Notifications
14. Response validation
15. Status page
16. SSRF protection
17. Tests
18. Docker
19. Deployment

Polish
────────────────────────
20. Better analytics
21. Better charts
22. Webhooks
23. Advanced filtering
24. Performance improvements
25. Portfolio documentation
```

## 20. Final Acceptance Test

The project is ready for portfolio demonstration when this scenario
works end-to-end:

``` text
User registers
      ↓
Creates "Payment API" monitor
      ↓
Monitor is scheduled
      ↓
Worker sends HTTP request
      ↓
API returns 200
      ↓
Result stored
      ↓
Dashboard shows GREEN
      ↓
Test API starts returning 500
      ↓
Worker detects failures
      ↓
Failure threshold reached
      ↓
Incident created
      ↓
Notification sent
      ↓
Test API returns 200 again
      ↓
Recovery detected
      ↓
Incident resolved
      ↓
Dashboard shows recovery
      ↓
Historical chart reflects outage
```

This end-to-end scenario should be the project's primary definition of
success.
