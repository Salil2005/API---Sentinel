# API Sentinel --- Technology Stack

## 1. Architecture

API Sentinel uses a modular monorepo architecture:

``` text
api-sentinel/
├── client/       # React frontend
├── server/       # Express REST API
├── worker/       # BullMQ monitoring worker
├── shared/       # Shared validation/types/constants
└── test-api/     # Local failure simulation service
```

## 2. Frontend

### React + Vite

Used for the dashboard and authenticated application.

### Tailwind CSS

Used for responsive UI styling.

### React Router

Used for client-side routing.

### TanStack Query

Used for server-state fetching, caching, invalidation, and request
lifecycle management.

### Axios or Fetch

Used for HTTP communication with the backend.

### Recharts

Used for:

-   Response-time charts
-   Uptime trends
-   Check-result visualization

## 3. Backend

### Node.js

Runtime for API server and monitoring worker.

### Express.js

REST API framework.

Responsibilities:

-   Authentication
-   Monitor CRUD
-   Dashboard data
-   Incident queries
-   Notification configuration
-   Public status endpoints

### Mongoose

MongoDB ODM for schemas, validation, and database access.

### Zod

Request and configuration validation.

### bcrypt

Password hashing.

### Helmet

HTTP security headers.

### CORS

Controlled frontend/backend cross-origin access.

### Rate limiting

Protect authentication and public endpoints.

## 4. Database

### MongoDB Atlas

Primary database.

Collections:

-   users
-   monitors
-   checkResults
-   incidents
-   notificationConfigs
-   statusPages

Important indexes:

-   users.email unique
-   monitors.userId
-   monitors.active
-   checkResults.monitorId + checkedAt
-   incidents.monitorId + startedAt
-   statusPages.publicId unique

## 5. Queue and Scheduling

### Redis

Used as the backing store for job queues.

### BullMQ

Used for:

-   Scheduled monitoring jobs
-   Retry handling
-   Worker processing
-   Job lifecycle management

Do not use an unbounded `setInterval()` loop for production-style
monitoring.

## 6. HTTP Monitoring

Use Node.js `fetch()` or Axios.

Every check should:

1.  Validate the target.
2.  Start a timer.
3.  Send the HTTP request.
4.  Enforce timeout.
5.  Capture response status.
6.  Capture response time.
7.  Optionally validate response content.
8.  Persist the result.
9.  Update incident state.

## 7. Notifications

Initial implementation:

-   Email
-   Generic webhook

Later:

-   Slack
-   Discord
-   Telegram

Notifications should be asynchronous where practical.

## 8. Development Tools

-   Git
-   GitHub
-   VS Code
-   Postman
-   Docker
-   ESLint
-   Prettier
-   npm

## 9. Deployment

### Frontend

Vercel.

### Backend

Render.

### Worker

Render as a separate worker/background service if the selected plan
supports the required workload.

### Database

MongoDB Atlas.

### Redis

Use a free-tier Redis-compatible service available at deployment time.

## 10. Environment Variables

Example:

``` text
NODE_ENV=
PORT=
MONGODB_URI=
REDIS_URL=
JWT_SECRET=
CLIENT_URL=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
```

Never commit `.env` files.

## 11. Why this stack

The stack is intentionally familiar and portfolio-friendly:

-   MERN demonstrates full-stack development.
-   Redis + BullMQ demonstrates asynchronous/background processing.
-   MongoDB demonstrates persistence and analytics.
-   React demonstrates dashboard/UI development.
-   SSRF protection demonstrates security awareness.
-   Docker demonstrates reproducible local development.
