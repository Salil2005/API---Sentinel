# API Sentinel --- Engineering Rules

## 1. General Rules

1.  Keep frontend, API server, worker, and test API separated by
    responsibility.
2.  Prefer simple, maintainable code over unnecessary abstraction.
3.  Do not put business logic directly inside Express route handlers.
4.  Use services for business operations.
5.  Validate all external input.
6.  Never commit secrets.
7.  Every database query involving user-owned resources must enforce
    ownership.

## 2. API Rules

1.  Use RESTful resource naming.
2.  Use consistent JSON response structures.
3.  Return appropriate HTTP status codes.
4.  Validate request bodies, query parameters, and route parameters.
5.  Apply rate limits to authentication and abuse-prone endpoints.
6.  Never expose internal stack traces to clients in production.

## 3. Authentication Rules

1.  Passwords must be hashed using bcrypt or an equivalent secure
    password hashing function.
2.  Do not store plaintext passwords.
3.  Prefer HTTP-only cookies for browser authentication.
4.  Use secure cookies in production.
5.  Protect authenticated routes with middleware.
6.  Always scope resources to the authenticated user.

## 4. Monitoring Rules

1.  Every check must have a timeout.
2.  Never allow unbounded request duration.
3.  Every check must record a timestamp.
4.  Every check must record response time when measurable.
5.  Classify failures consistently.
6.  Do not create an incident from a single transient failure unless
    explicitly configured.
7.  Prevent duplicate open incidents for the same monitor.
8.  Recovery must close the correct incident.
9.  Paused monitors must not execute monitoring jobs.
10. Deleted monitors must not continue producing checks.

## 5. SSRF Rules

This is a critical security area.

The worker must never blindly fetch a user-provided URL.

Block:

``` text
localhost
127.0.0.0/8
0.0.0.0
::1
RFC1918 private IPv4 ranges
link-local ranges
cloud metadata endpoints
other internal/reserved destinations
```

Also consider DNS rebinding and redirect-based SSRF.

Redirect handling should revalidate every redirect destination.

For the portfolio V1, a conservative allowlist approach is acceptable if
it makes monitoring functionality slightly less flexible.

## 6. Request Credential Rules

If authenticated API monitoring is implemented:

1.  Never expose stored secrets to the frontend after saving.
2.  Do not log Authorization headers.
3.  Do not log cookies.
4.  Encrypt sensitive stored values.
5.  Restrict which headers can be configured.
6.  Avoid storing secrets unless the feature is necessary.

## 7. Database Rules

1.  Use indexes for common queries.
2.  Index `monitorId + checkedAt`.
3.  Use unique indexes where required.
4.  Avoid storing large response bodies by default.
5.  Implement retention for old check results.
6.  Use aggregation for analytics where appropriate.

## 8. Queue Rules

1.  Jobs must be idempotent where possible.
2.  Job retries must have limits.
3.  Failed jobs must not create duplicate incidents.
4.  Worker errors must be logged with monitor/job context.
5.  Monitor deletion must clean up scheduled jobs.
6.  Do not run monitoring work inside normal HTTP request handlers.

## 9. Free-Tier Rules

The initial deployment targets approximately 50 users.

Recommended limits:

``` text
5 monitors/user
5-minute minimum interval
30-second maximum timeout
3-failure incident threshold
bounded check history
```

Avoid unlimited monitoring.

## 10. Frontend Rules

1.  Do not expose backend secrets.
2.  Use environment variables only for public frontend configuration.
3.  Keep API calls in a dedicated API/data layer.
4.  Use loading, empty, success, and error states.
5.  Do not trust frontend validation alone.
6.  Handle expired sessions gracefully.
7.  Avoid polling more frequently than necessary.

## 11. Logging Rules

Never log:

-   Passwords
-   JWTs
-   API keys
-   Authorization headers
-   Cookies
-   Sensitive request bodies

Useful logs:

``` text
worker started
job processed
monitor checked
check failed
incident opened
incident resolved
notification failed
```

Include:

``` text
jobId
monitorId
userId where appropriate
errorType
duration
```

## 12. Git Rules

Use meaningful commits:

``` text
feat: add monitor creation
feat: add monitoring worker
fix: prevent duplicate incidents
security: block private IP targets
test: add timeout monitoring tests
```

Never commit:

``` text
.env
secrets
API keys
production credentials
```

## 13. Definition of Done

A feature is not complete until:

-   Validation exists.
-   Error handling exists.
-   Authorization is checked.
-   Tests cover important behavior.
-   Logs do not leak secrets.
-   UI handles failure states.
-   Documentation is updated where necessary.
