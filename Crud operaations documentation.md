# NestJS Admin CRUD — API Documentation

Quick reference for **all endpoint groups** in the `nestjs-admin-crud` package: Teams, Team Memberships, Users, and Job Titles.

## 1. Base URL, authentication, and access

- **Base URL:** `http://localhost:<PORT>/api`
- **Authentication:** include a valid JWT on every request:
  `Authorization: Bearer <JWT_TOKEN>`
- **Content type for JSON requests:** `Content-Type: application/json`
- The controllers use explicit `api/...` paths. Do **not** also configure `app.setGlobalPrefix('api')` unless you remove `api` from the controller paths.

| Role | Access |
|---|---|
| `SUPER_SUPERVISOR` | Organization-wide admin access; manages teams, users, memberships, and job titles |
| `SUPERVISOR` | Reads permitted users/teams and manages memberships for teams they supervise; can update teams within the service's scope |
| Employee/other roles | No access to these administrative endpoints |

All routes use JWT and role guards. Resource-level service checks also apply.

## 2. Teams

Base path: `/api/teams`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/teams` | Create a team | Super Supervisor |
| `GET` | `/teams?page=1&limit=20` | List teams | Supervisor / Super Supervisor |
| `GET` | `/teams/:id` | Get team details and active members | Supervisor / Super Supervisor, within scope |
| `PATCH` | `/teams/:id` | Update team name/description; Super Supervisor may change `isActive` | Supervisor / Super Supervisor, within scope |
| `PATCH` | `/teams/:id/supervisor` | Change team supervisor | Super Supervisor |

### Create team — `POST /api/teams`

```json
{
  "name": "Design",
  "description": "Design team",
  "supervisorId": "SUPERVISOR_USER_ID"
}
```

- `name`: required, 2–120 characters
- `description`: optional, max 10,000 characters
- `supervisorId`: required ID of an active supervisor (validated by service)

### List teams — `GET /api/teams`

Query parameters:
- `page`: integer ≥ 1; default `1`
- `limit`: integer 1–100; default `20`

Super Supervisors see all teams; Supervisors see teams they supervise. The response is paginated according to the service implementation.

### Get team — `GET /api/teams/:id`

Replace `:id` with the team ID. Returns team details and active membership information. A Supervisor must supervise the requested team.

### Update team — `PATCH /api/teams/:id`

Send only the fields to change:

```json
{
  "name": "Creative Design",
  "description": "Updated description",
  "isActive": true
}
```

- `name`: optional, 2–120 characters
- `description`: optional, max 10,000 characters
- `isActive`: optional boolean; changing this is restricted to the Super Supervisor by the service

### Change team supervisor — `PATCH /api/teams/:id/supervisor`

```json
{
  "supervisorId": "NEW_SUPERVISOR_USER_ID"
}
```

Super Supervisor only. The service validates the new supervisor.

## 3. Team memberships

Base path: `/api/teams/:teamId/memberships`

A user may belong to multiple teams. Removing a membership does **not** delete the database row; it sets `endedAt` so history is preserved.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/teams/:teamId/memberships` | List active members | Supervisor of team / Super Supervisor |
| `GET` | `/teams/:teamId/memberships?history=true` | Include membership history | Supervisor of team / Super Supervisor |
| `POST` | `/teams/:teamId/memberships` | Add a user to the team | Supervisor of team / Super Supervisor |
| `DELETE` | `/teams/:teamId/memberships/:membershipId` | End a membership | Supervisor of team / Super Supervisor |

### List memberships — `GET /api/teams/:teamId/memberships`

- `teamId`: team ID in the URL
- `history`: optional query parameter; set to `true` to include historical membership rows. Otherwise, the endpoint lists active memberships.

### Add member — `POST /api/teams/:teamId/memberships`

```json
{
  "userId": "USER_ID"
}
```

Adds an active user to the specified team. The service checks team access and membership eligibility, including preventing an already-active duplicate membership.

### Remove member — `DELETE /api/teams/:teamId/memberships/:membershipId`

No request body required. Ends the membership by setting its end date; it does not hard-delete the record.

## 4. Users

Base path: `/api/users`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/users` | Create a user | Super Supervisor |
| `GET` | `/users?page=1&limit=20&search=ali&role=EMPLOYEE&jobTitleId=ID&isActive=true` | List/filter users | Supervisor / Super Supervisor, within scope |
| `GET` | `/users/:id` | Get user profile | Supervisor / Super Supervisor, within scope |
| `PATCH` | `/users/:id` | Update user details | Super Supervisor |
| `PATCH` | `/users/:id/deactivate` | Deactivate user | Super Supervisor |
| `PATCH` | `/users/:id/reactivate` | Reactivate user | Super Supervisor |

### Create user — `POST /api/users`

```json
{
  "fullName": "Example User",
  "email": "user@example.com",
  "password": "UseAStrongPassword123!",
  "roleId": "ROLE_ID",
  "jobTitleId": "JOB_TITLE_ID"
}
```

- `fullName`: required, 2–160 characters
- `email`: required, valid email, max 254 characters; must be unique
- `password`: required, 10–128 characters
- `roleId`: required role ID
- `jobTitleId`: optional; may be omitted or set to `null`

The service hashes passwords with bcrypt cost 12. Password hashes should never be exposed in API responses.

### List users — `GET /api/users`

Query parameters:
- `page`: integer ≥ 1; default `1`
- `limit`: integer 1–100; default `20`
- `search`: optional search string
- `role`: optional role code/filter
- `jobTitleId`: optional job-title ID
- `isActive`: optional `true` or `false`

Super Supervisors can list all users. Supervisors are scoped to users with active memberships in their active supervised teams.

### Get user — `GET /api/users/:id`

Returns the user's profile and related role/job title/team membership details allowed by the service. Supervisors cannot access users outside their scope.

### Update user — `PATCH /api/users/:id`

```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "roleId": "ROLE_ID",
  "jobTitleId": null
}
```

All fields are optional. Use `jobTitleId: null` to clear the job title. Email must remain unique.

### Deactivate/reactivate user

- `PATCH /api/users/:id/deactivate`
- `PATCH /api/users/:id/reactivate`

Neither endpoint requires a body. Deactivation preserves existing task and membership history; reactivation marks the account active again.

> **Important integration note:** this package defines `AdminUsersController` at the same `/api/users` path as the existing Users API. Do **not** register both controllers. Merge the CRUD handlers into your existing UsersController/UsersService or replace the old controller deliberately. The separate `nestjs-users-crud-update` patch was created specifically to extend the existing Users API.

## 5. Job titles

Base path: `/api/job-titles`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/job-titles` | Create a job title | Super Supervisor |
| `GET` | `/job-titles?page=1&limit=20&activeOnly=true` | List job titles | Supervisor / Super Supervisor |
| `GET` | `/job-titles/:id` | Get a job title | Supervisor / Super Supervisor |
| `PATCH` | `/job-titles/:id` | Update/deactivate a job title | Super Supervisor |

### Create job title — `POST /api/job-titles`

```json
{
  "name": "Digital Media",
  "description": "Digital media responsibilities"
}
```

- `name`: required, 2–120 characters
- `description`: optional, max 10,000 characters
- Names are normalized (lowercase and repeated spaces collapsed) for uniqueness.

### List job titles — `GET /api/job-titles`

Query parameters:
- `page`: integer ≥ 1; default `1`
- `limit`: integer 1–100; default `20`
- `activeOnly`: set to `true` to return active job titles only

### Get job title — `GET /api/job-titles/:id`

Replace `:id` with the job-title ID.

### Update job title — `PATCH /api/job-titles/:id`

```json
{
  "name": "Digital Content",
  "description": "Updated description",
  "isActive": true
}
```

All fields are optional:
- `name`: 2–120 characters
- `description`: string or `null`
- `isActive`: boolean

Use `isActive: false` to deactivate a title instead of deleting it.

## 6. Pagination response

The endpoints that list records accept `page` and `limit` (default `1` and `20`; maximum `limit` is `100`). The exact response object is defined by each service, but is intended to provide the records and pagination information.

Example shape (illustrative):

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Base path: `/api/roles`. All endpoints require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/roles?page=1&limit=20` | List roles | Supervisor / Super Supervisor |
| GET | `/api/roles/:id` | Get role, including assigned-user count | Supervisor / Super Supervisor |
| POST | `/api/roles` | Create role | Super Supervisor |
| PATCH | `/api/roles/:id` | Update role | Super Supervisor |
| DELETE | `/api/roles/:id` | Delete role if no users are assigned | Super Supervisor |

## Create request

```json
{
  "code": "TEAM_LEAD",
  "name": "Team Lead",
  "hierarchyLevel": 2
}
```

- `code`: 2–40 chars; normalized to uppercase; unique
- `name`: 2–80 chars; unique
- `hierarchyLevel`: integer from 1 to 3, aligned with the current task/assignment logic

## Update request

Send only fields to change:

```json
{
  "name": "Senior Team Lead",
  "hierarchyLevel": 2
}
```

## Safety rules

- Only an active `SUPER_SUPERVISOR` may create, update, or delete roles.
- Supervisors can read roles.
- A role assigned to any users cannot be deleted. Reassign those users first.
- The `SUPER_SUPERVISOR` role cannot be deleted.
- Updating a role's code or hierarchy level can change authorization/assignment behavior. Keep role codes such as `SUPERVISOR` and `SUPER_SUPERVISOR` consistent with the rest of the application.
- This patch does not include role seeding or change the Prisma schema.

## 7. Common HTTP errors

| Status | Meaning |
|---|---|
| `400 Bad Request` | Invalid request data or business-rule validation failed |
| `401 Unauthorized` | JWT missing, invalid, or expired |
| `403 Forbidden` | User role or resource scope does not allow the action |
| `404 Not Found` | Requested record does not exist or is not accessible |
| `409 Conflict` | Duplicate value such as an email or normalized job-title name, if handled as a conflict by the service |

## 8. Integration checklist

1. Register `TeamsModule`, `TeamMembershipsModule`, and `JobTitlesModule` in `AppModule`.
2. For users, **merge the package's admin CRUD into the existing Users API** or use the dedicated users-update patch; do not register duplicate `/api/users` controllers.
3. Confirm `bcrypt` is installed.
4. Ensure your `Roles` decorator/guard correctly handles method-level role overrides.
5. Do not add a second global `api` prefix while controllers already include `api`.
6. Run `npm run build` and test the routes with a valid JWT.

**Scope note:** This guide documents the endpoints included in the `NestJS Admin CRUD` ZIP, not the separate task-intake/task workflow endpoints.
