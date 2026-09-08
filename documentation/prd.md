# API Sentinel --- Product Requirements Document

## 1. Product Overview

API Sentinel is a developer-focused API monitoring platform. Developers
register HTTP/HTTPS endpoints and the system periodically checks their
availability, response time, expected status code, and optionally
response content.

The initial release is designed for portfolio-scale usage: approximately
50 users and a small number of monitors per user. The product must run
on a zero-cost/free-tier-oriented architecture during development and
initial deployment.

## 2. Problem Statement

Developers often discover production API failures only after users
report broken functionality or after manually inspecting logs. An API
can be unavailable, return server errors, become slow, time out, or
return an unexpected response while still returning HTTP 200.

API Sentinel provides external, automated checks and alerts so
developers can detect API reliability problems earlier.

## 3. Target Users

-   Individual developers
-   Students and portfolio users
-   Small development teams
-   Freelancers maintaining client APIs
-   Developers running personal or side-project APIs

## 4. Goals

### Primary goals

1.  Allow users to create and manage API monitors.
2.  Automatically execute scheduled health checks.
3.  Measure status code, latency, timeout, and request outcome.
4.  Detect repeated failures and create incidents.
5.  Detect recovery and resolve incidents.
6.  Display historical health and latency data.
7.  Send basic notifications for incidents.
8.  Provide a public status page.
9.  Protect the monitoring worker against SSRF and unsafe target URLs.

### Non-goals for V1

-   Enterprise observability
-   Full distributed tracing
-   Log aggregation
-   Infrastructure/server monitoring
-   Browser synthetic monitoring
-   High-volume commercial-scale monitoring
-   Guaranteed global multi-region checks

## 5. Core Features

### Authentication

-   Register
-   Login
-   Logout
-   Password hashing
-   HTTP-only authentication cookie
-   Protected routes

### Monitor management

A monitor contains:

-   Name
-   URL
-   HTTP method
-   Check interval
-   Timeout
-   Expected HTTP status
-   Optional expected response/body rule
-   Active/inactive state

Supported initial methods:

-   GET
-   POST
-   PUT
-   PATCH
-   DELETE
-   HEAD

### Health checking

Each check should record:

-   Timestamp
-   Success/failure
-   HTTP status
-   Response time
-   Error category
-   Optional response validation result

### Monitor states

-   Healthy
-   Degraded
-   Down
-   Paused

### Incident management

An incident is created only after the configured failure threshold is
reached.

An incident contains:

-   Monitor
-   Start time
-   End time
-   Current status
-   Failure count
-   Reason
-   Duration

### Notifications

V1 should support email or webhook notifications.

Notification events:

-   Incident opened
-   Incident resolved

### Dashboard

Show:

-   Total monitors
-   Healthy monitors
-   Degraded monitors
-   Down monitors
-   Overall uptime
-   Recent incidents
-   Recent check results
-   Response-time chart

### Public status page

Users can publish a read-only status page containing selected monitors
and their current status.

## 6. Functional Requirements

### FR-01 Authentication

Users must be able to register and authenticate securely.

### FR-02 Create monitor

Authenticated users must be able to create a monitor after URL and
configuration validation.

### FR-03 Scheduled checks

The system must execute active monitors according to their configured
interval.

### FR-04 Timeout

A request must fail when it exceeds its configured timeout.

### FR-05 Result persistence

Every completed check must produce a persistent check-result record.

### FR-06 Incident creation

The system must create an incident after N consecutive failures, where N
is configurable within safe limits.

### FR-07 Incident resolution

The system must resolve an open incident after successful recovery
according to the recovery policy.

### FR-08 Historical analytics

Users must be able to inspect recent check results and uptime/latency
metrics.

### FR-09 Notifications

The system must send a notification when an incident opens or resolves,
subject to user settings.

### FR-10 Public status

Users must be able to publish a public status page without exposing
private monitor configuration.

## 7. Non-Functional Requirements

### Security

-   Passwords must be hashed.
-   Authentication cookies must be HTTP-only and secure in production.
-   User input must be validated.
-   API routes must be rate-limited.
-   Target URLs must be protected against SSRF.
-   Private IP ranges and unsafe network targets must be blocked.
-   Secrets must never be committed to source control.

### Reliability

-   Monitoring jobs should be retryable.
-   Duplicate incident creation must be prevented.
-   Worker failures must not corrupt monitor state.

### Performance

The portfolio deployment should support approximately 50 users and a few
hundred monitors without requiring complex infrastructure.

### Observability

Application logs should include:

-   Job ID
-   Monitor ID
-   Worker result
-   Error category
-   Incident transitions

## 8. Success Metrics

For the portfolio release:

-   A user can create a monitor in under one minute.
-   A scheduled check produces a result reliably.
-   Failure → incident → notification → recovery can be demonstrated
    locally.
-   Dashboard metrics agree with stored check results.
-   SSRF protection blocks local/private targets.
-   The system can be deployed using free-tier-oriented infrastructure.

## 9. Example User Journey

1.  User registers.
2.  User opens Dashboard.
3.  User selects Add Monitor.
4.  User enters endpoint details.
5.  API Sentinel validates the target.
6.  Monitor is stored.
7.  A recurring monitoring job is scheduled.
8.  Worker executes the request.
9.  Result is stored.
10. Dashboard displays health and latency.
11. Repeated failures create an incident.
12. User receives a notification.
13. API recovers.
14. Incident is resolved.

## 10. V1 Limits

Recommended initial limits:

-   5 monitors per user
-   Minimum interval: 5 minutes
-   Maximum timeout: 30 seconds
-   Failure threshold: 3
-   Limited historical retention
-   One monitoring region
-   Basic email/webhook notifications
