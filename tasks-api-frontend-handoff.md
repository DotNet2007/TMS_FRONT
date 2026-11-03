# Tasks API — Frontend Handoff

This document is based on the supplied `tasks.controller.ts` and `tasks.service.ts` and is intended for a frontend developer integrating the UI with the NestJS API.

## 1. Base URL and conventions

- **Base path:** `/api/tasks`
- **Example:** `http://localhost:<PORT>/api/tasks`
- **Authentication:** include `Authorization: Bearer <JWT_TOKEN>` on every request.
- **JSON:** use `Content-Type: application/json`.
- **Roles:** `EMPLOYEE`, `SUPERVISOR`, `SUPER_SUPERVISOR`, as listed per endpoint.
- **Dates:** send ISO 8601 dates, e.g. `2026-11-15T14:00:00.000Z`. Creation and deadline updates require a future date.
- The controller paths already contain `api`; do not add a second global `api` prefix unless the controller paths are changed.

## 2. Endpoint summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/tasks/my-tasks` | List tasks in the caller's scope |
| `GET` | `/api/tasks/:id` | Get task, submissions, events, deadline changes |
| `GET` | `/api/tasks/:id/submissions` | Get submission history |
| `GET` | `/api/tasks/:id/history` | Get audit events, deadline changes, reviews |
| `POST` | `/api/tasks/:id/submissions` | Submit completion note |
| `POST` | `/api/tasks/:id/reviews` | Approve submission or request rework |
| `PATCH` | `/api/tasks/:id/deadline` | Change deadline with reason |
| `POST` | `/api/tasks/intake` | Analyze pasted email text or screenshot |
| `POST` | `/api/tasks/intake/process` | Alias of intake endpoint |
| `POST` | `/api/tasks/intake/image` | Alias of intake endpoint |
| `GET` | `/api/tasks/intake/:id` | Retrieve saved intake and proposals |
| `POST` | `/api/tasks/intake/:analysisId/proposals/:proposalId/recommend` | Recommend employee for a proposal |
| `POST` | `/api/tasks/intake/:analysisId/proposals/:proposalId/draft` | Create task and email draft |
| `POST` | `/api/tasks/intake/:analysisId/proposals/:proposalId/draft-and-confirm` | Create draft and record dispatch confirmation |
| `POST` | `/api/tasks/email-drafts/:id/confirm-sent` | Confirm manually sent email and activate linked tasks |

All routes require JWT authentication. Task endpoints allow all three roles unless otherwise specified; intake/draft/deadline/review routes are restricted to supervisors.

## 3. List tasks

### `GET /api/tasks/my-tasks`

Optional query parameter: `status`, e.g. `/api/tasks/my-tasks?status=SUBMITTED`.

Scope:
- `EMPLOYEE`: tasks assigned to the current user.
- `SUPERVISOR`: tasks they created or tasks belonging to teams they supervise.
- `SUPER_SUPERVISOR`: all tasks.

Response shape:
```json
{
  "status": "success",
  "count": 1,
  "tasks": [
    {
      "id": "task-id",
      "title": "Prepare monthly report",
      "deadline": "2026-11-15T14:00:00.000Z",
      "status": "DISPATCHED",
      "assignee": { "id": "user-id", "fullName": "Example Employee", "email": "employee@example.com" },
      "createdBy": { "id": "supervisor-id", "fullName": "Example Supervisor" },
      "team": { "id": "team-id", "name": "Operations" },
      "_count": { "submissions": 0, "reviews": 0 }
    }
  ]
}
```
Example is illustrative; additional task fields may be returned.

## 4. Task details, submissions, and history

### `GET /api/tasks/:id`

Returns `task`, `submissions`, `events`, and `deadlineChanges`. Submissions are newest-first and include submitter, reviews/reviewers, and attachment metadata. Events and deadline changes are newest-first.

Access: Super Supervisor, assigned employee, task creator, or supervisor of the task's team.

### `GET /api/tasks/:id/submissions`

Returns:
```json
{
  "status": "success",
  "taskId": "task-id",
  "submissions": []
}
```
Use for a screen that needs only submissions. Each submission includes the submitter, reviews, and attachment metadata.

### `GET /api/tasks/:id/history`

Returns:
```json
{
  "status": "success",
  "taskId": "task-id",
  "events": [],
  "deadlineChanges": [],
  "reviews": []
}
```
Use for the activity timeline. History arrays are ordered oldest-first. Review records include reviewer and related submission summary.

## 5. Analyze an email (text or screenshot)

### `POST /api/tasks/intake`
Aliases: `POST /api/tasks/intake/process`, `POST /api/tasks/intake/image`.

Exactly one input must be sent: `emailText` **or** `file`.

**Option A — pasted text**

Headers: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`.

```json
{
  "emailText": "Please prepare the monthly sales report by Friday..."
}
```

- Text must be non-empty and no more than 100,000 characters.
- Do not send both text and file.
- The response includes extracted proposals, predicted job titles, prediction status/reason, and possibly employee recommendations.
- This step does **not** create tasks or send email.

**Option B — screenshot upload**

Use `multipart/form-data` with one file field named `file`. Allowed image MIME types: JPEG, PNG, WEBP, BMP, TIFF. Maximum size: 10 MB.

```ts
const formData = new FormData();
formData.append('file', file);

const response = await fetch(`${API_BASE_URL}/api/tasks/intake`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData, // Let the browser set the multipart Content-Type boundary.
});
```

Do not set JSON Content-Type for an upload.

Typical response shape:
```json
{
  "status": "success",
  "analysisId": "analysis-id",
  "analysis": {
    "id": "analysis-id",
    "source": "IMAGE_UPLOAD",
    "analysisStatus": "COMPLETED",
    "createdAt": "2026-10-27T07:00:00.000Z"
  },
  "taskCount": 1,
  "proposals": [
    {
      "proposalId": "proposal-id",
      "title": "Prepare monthly sales report",
      "description": "Prepare the report",
      "predictedJobTitle": "Data Analyst",
      "predictionStatus": "success",
      "predictionReason": "Matches reporting responsibilities",
      "suggestedDeadline": "2026-11-15T00:00:00.000Z",
      "status": "DRAFT",
      "recommendation": {
        "userId": "employee-id",
        "displayName": "Example Employee",
        "email": "employee@example.com",
        "jobTitle": "Data Analyst",
        "role": "Employee",
        "hierarchyLevel": 1,
        "workload": {}
      },
      "recommendationMessage": null
    }
  ]
}
```
Values are illustrative. `recommendation` may be `null`; display `recommendationMessage` when present. Analysis status may be `NO_TASKS`, `NEEDS_REVIEW`, or `COMPLETED`.

## 6. Retrieve intake and re-run recommendation

### `GET /api/tasks/intake/:id`

Replace `:id` with `analysisId` from intake. Returns analysis metadata and proposals ordered oldest-first. Only the intake creator or a Super Supervisor can access it.

### `POST /api/tasks/intake/:analysisId/proposals/:proposalId/recommend`

No request body.

Returns the saved proposal plus an employee recommendation, workload, matched hierarchy level, candidate count, and `recommendationScope`. The proposal must belong to the intake, have a successful prediction, and not already be `TASK_CREATED` or `REJECTED`. This endpoint does not create a task or email draft. Only the intake creator or Super Supervisor may use it.

## 7. Create task and email draft

### `POST /api/tasks/intake/:analysisId/proposals/:proposalId/draft`

Body:
```json
{
  "assigneeId": "employee-id",
  "title": "Prepare monthly sales report",
  "description": "Use the latest monthly figures",
  "deadline": "2026-11-15T14:00:00.000Z",
  "emailSubject": "Task: Monthly sales report",
  "emailBody": "Please prepare the monthly sales report by the deadline..."
}
```

Required: `assigneeId`, `deadline`, `emailSubject`, `emailBody`, and effectively `title` (send it even though the controller type marks it optional). `description` is optional. Subject must be at most 255 characters. Deadline must be valid and in the future.

On success, the API:
1. Validates intake, proposal, caller access, prediction and assignee eligibility.
2. Resolves the task team from the supervisor's team, or from the selected employee's active team membership for Super Supervisor.
3. Creates a task with status `READY_TO_DISPATCH`.
4. Creates a linked email draft with status `DRAFT`.
5. Marks the proposal `TASK_CREATED`.

The response includes `task`, `emailDraft` (ID, subject, body, status and recipient), and employee `selection`.

**No email is sent and the task is not activated yet.** The UI should display the draft and prompt the supervisor to send it manually.

### `POST /api/tasks/intake/:analysisId/proposals/:proposalId/draft-and-confirm`

Uses the same body as `/draft`.

**Important:** this does not send a real email. It creates the task/draft and immediately records an app-level confirmation, changes the task to `DISPATCHED`, and explicitly returns that no real email was sent. Prefer the `/draft` → manually send → `/email-drafts/:id/confirm-sent` flow.

## 8. Confirm a manually sent email

### `POST /api/tasks/email-drafts/:id/confirm-sent`

`:id` is the email draft ID returned by the draft endpoint.

Body (optional note):
```json
{
  "note": "Sent manually through Outlook"
}
```

Suggested UI flow:
1. Show the recipient, subject and body.
2. Supervisor sends the message manually using Gmail/Outlook.
3. Supervisor clicks “I sent this email”.
4. Call this endpoint.
5. On success, update linked tasks to `DISPATCHED`.

Only the draft preparer or Super Supervisor can confirm. The draft must still be `DRAFT` and have linked tasks. The endpoint records the user's confirmation; it does not verify actual email delivery.

## 9. Employee submits completion

### `POST /api/tasks/:id/submissions`

Body:
```json
{
  "completionNote": "Completed the report and checked the figures."
}
```

`completionNote` is required and cannot be blank. Although the controller allows all three roles, the service permits only the assigned employee to submit. Task status must be `DISPATCHED` or `REWORK`.

On success, a submission record is created, task status becomes `SUBMITTED`, and a task event is recorded. Response includes `submission` and `task: { id, status: "SUBMITTED" }`.

Note: no file-upload endpoint is exposed here; submission currently accepts only the completion note.

## 10. Supervisor reviews submission

### `POST /api/tasks/:id/reviews`

Approve:
```json
{
  "submissionId": "submission-id",
  "decision": "APPROVE",
  "feedback": "Looks good."
}
```

Request rework:
```json
{
  "submissionId": "submission-id",
  "decision": "REWORK",
  "feedback": "Please correct the totals in section 2."
}
```

- Supervisor or Super Supervisor only.
- Task must be `SUBMITTED`.
- `submissionId` must belong to this task.
- `decision` must be `APPROVE` or `REWORK`.
- Feedback is mandatory for `REWORK`.
- Assigned employee cannot review their own submission.
- `APPROVE` sets status `COMPLETED`; `REWORK` sets status `REWORK`.

## 11. Change deadline

### `PATCH /api/tasks/:id/deadline`

Body:
```json
{
  "deadline": "2026-11-20T14:00:00.000Z",
  "reason": "The source data arrived later than planned."
}
```

Both fields are required. The deadline must be valid, in the future, and different from the current deadline. Completed/cancelled tasks cannot be changed. Only the task creator/supervisor or Super Supervisor can change it. The change is stored in deadline history and task events.

## 12. Status values

Observed task statuses:
- `READY_TO_DISPATCH`: task and draft saved, awaiting manual email dispatch confirmation.
- `DISPATCHED`: dispatch confirmation recorded; employee may submit.
- `SUBMITTED`: waiting for review.
- `COMPLETED`: approved.
- `REWORK`: returned to employee for correction.
- `CANCELLED`: checked by deadline logic, but no cancellation route is exposed here.

Intake statuses: `NO_TASKS`, `NEEDS_REVIEW`, `COMPLETED`.
Proposal statuses include `NEEDS_REVIEW`, `DRAFT`, `TASK_CREATED`, `REJECTED`.

Use exact status values returned by the API.

## 13. Errors

- `400`: invalid input, unsupported decision, missing note/reason, invalid deadline, ineligible assignee, or already-processed proposal.
- `401`: missing/invalid/expired JWT.
- `403`: insufficient role or no access to the task/intake.
- `404`: task, intake, proposal, or submission not found.
- `502`: AI service error/invalid response.
- `503`: AI service unavailable.

Show the backend's `message` where appropriate. On intake failure, retain the text/file selection so the user can retry.

## 14. Suggested frontend flow

1. **Email intake:** text area or screenshot upload; send exactly one input.
2. **AI proposal review:** show extracted tasks, prediction status/reason, suggested deadline and recommendation/message.
3. **Proposal setup:** let supervisor edit title/description/deadline, choose assignee, compose subject/body.
4. **Draft preview:** show recipient and message; user sends manually, then confirms in app.
5. **Task list:** use `my-tasks` with optional status filter.
6. **Task details:** show task and submissions.
7. **Employee submission:** completion-note form.
8. **Supervisor review:** approve or request rework.
9. **History panel:** use the history endpoint for audit events, reviews and deadline changes.

## 15. Notes and limitations from the supplied code

- The three intake routes are aliases for the same service method.
- Intake currently stores `analysis.source` as `IMAGE_UPLOAD` even for pasted text. Do not infer the actual input method from that field without a backend fix.
- Task detail includes attachment metadata, but no upload/download endpoint is exposed in this controller.
- No route is exposed here for deleting tasks, editing an existing task's title/description, or directly assigning a task outside the proposal intake flow.
- Supervisor `my-tasks` includes tasks created by that supervisor or belonging to teams they supervise; it is not strictly limited to tasks assigned to those teams.
- `draft-and-confirm` does not send a real email.
- Service methods such as `recommendTask` and `createTaskDraft` exist in the file but are not exposed as controller routes; frontend should use the routes listed above.
- Confirm edge-case status transitions with backend before implementing special-case UI logic.
