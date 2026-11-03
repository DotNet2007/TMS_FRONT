# Task Assigner — Unified Email Intake API

## Overview

The unified intake endpoint accepts **either** an email screenshot or pasted email text. It extracts actionable tasks, predicts a job title for each task, and recommends an eligible employee.

Intake only prepares proposals for supervisor review. It does **not** create final tasks or send emails.

## Endpoint

- **Method:** `POST`
- **URL:** `/api/tasks/intake`
- **Local example:** `http://localhost:3000/api/tasks/intake`
- **Authentication:** JWT Bearer token
- **Allowed roles:** `SUPERVISOR`, `SUPER_SUPERVISOR`

Send exactly one input type per request: `file` **or** `emailText`, not both.

## Authentication

Include the JWT returned by your login endpoint:

```http
Authorization: Bearer <JWT>
```

The frontend must not send the creator's user ID or hierarchy level. The backend derives the authenticated creator and hierarchy from the JWT/user record.

## Option A — Upload an email screenshot

Use `multipart/form-data`.

| Field | Type | Required | Details |
|---|---|---:|---|
| `file` | File | Yes | Email screenshot. Accepted formats: JPEG, PNG, WEBP, BMP, TIFF. Maximum size: 10 MB. |

Example using `fetch`:

```javascript
const formData = new FormData();
formData.append("file", imageFile);

const response = await fetch("http://localhost:3000/api/tasks/intake", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Email intake failed");
}
```

Do **not** set the `Content-Type` header manually when using `FormData`; the browser must add the multipart boundary.

## Option B — Submit pasted email text

Use `application/json`.

### Request body

```json
{
  "emailText": "السيد الفاضل ... يرجى التكرم بتنفيذ طلب الشراء بصفة عاجلة."
}
```

| Field | Type | Required | Details |
|---|---|---:|---|
| `emailText` | string | Yes | Full email text, including useful subject/body/table text. Must not be empty. Maximum 100,000 characters. |

Example using `fetch`:

```javascript
const response = await fetch("http://localhost:3000/api/tasks/intake", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ emailText }),
});

const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Email intake failed");
}
```

## Successful response — `200 OK`

The response is the same for screenshot and text inputs. Example:

```json
{
  "status": "success",
  "message": "Input processed. Extracted tasks, job-title predictions, and employee recommendations are ready for supervisor review. No tasks or emails have been created.",
  "analysisId": "analysis-uuid",
  "analysis": {
    "id": "analysis-uuid",
    "source": "IMAGE_UPLOAD",
    "analysisStatus": "COMPLETED",
    "createdAt": "2026-10-21T10:00:00.000Z"
  },
  "sender": {
    "userId": "user-uuid",
    "displayName": "Supervisor Name",
    "email": "supervisor@example.com",
    "role": "SUPERVISOR",
    "hierarchyLevel": 2
  },
  "taskCount": 1,
  "proposals": [
    {
      "proposalId": "proposal-uuid",
      "title": "Execute the social media campaign purchase request",
      "description": "Execute the social media campaign purchase request",
      "sourceText": "Please execute the purchase request urgently.",
      "predictedJobTitle": "Senior Specialist, Media, Digital Media",
      "predictionStatus": "success",
      "predictionReason": "The request concerns a digital media campaign.",
      "suggestedDeadline": null,
      "status": "DRAFT",
      "recommendation": {
        "userId": "employee-uuid",
        "displayName": "Employee Name",
        "email": "employee@example.com",
        "jobTitle": "Senior Specialist, Media, Digital Media",
        "role": "EMPLOYEE",
        "hierarchyLevel": 3,
        "workload": 1
      },
      "recommendationMessage": null
    }
  ]
}
```

The values above are illustrative. Real IDs, names, titles, dates, and messages come from the backend.

### Response fields

#### Top level

| Field | Type | Meaning |
|---|---|---|
| `status` | string | `success` when intake was processed. |
| `message` | string | Explains that proposals are ready for review; no final task/email was created. |
| `analysisId` | string | ID for retrieving this intake and using proposal endpoints. |
| `analysis` | object | Analysis metadata. |
| `sender` | object or `null` | Authenticated creator information. |
| `taskCount` | number | Number of extracted proposals returned. |
| `proposals` | array | Extracted proposals and employee recommendations. |

#### `analysis`

- `id`: same identifier as `analysisId`.
- `source`: source marker currently returned by the backend.
- `analysisStatus`: commonly `COMPLETED`, `NEEDS_REVIEW`, or `NO_TASKS`.
- `createdAt`: ISO-8601 timestamp.

#### Each `proposals[]` item

| Field | Type | Meaning |
|---|---|---|
| `proposalId` | string | Proposal ID used by the next workflow endpoints. |
| `title` | string | Proposed task title. |
| `description` | string or `null` | Proposed task description. |
| `sourceText` | string or `null` | Supporting text extracted from the email. |
| `predictedJobTitle` | string or `null` | AI-predicted job title. |
| `predictionStatus` | string | Prediction result status; check for `success`. |
| `predictionReason` | string or `null` | Explanation for the prediction. |
| `suggestedDeadline` | ISO-8601 string or `null` | Deadline if the email provides a parseable date; otherwise `null`. |
| `status` | string | Proposal review status, such as `DRAFT` or `NEEDS_REVIEW`. |
| `recommendation` | object or `null` | Recommended employee, if one could be selected. |
| `recommendationMessage` | string or `null` | Explanation if a recommendation was not available. |

The `recommendation` object contains `userId`, `displayName`, `email`, `jobTitle`, `role`, `hierarchyLevel`, and `workload`.

A recommendation can be `null` if the prediction is unsuccessful or no eligible employee is found. The frontend should display `recommendationMessage` when provided and allow the supervisor to review or choose another employee.

## Errors

The response usually includes a `message`, `error`, and `statusCode`. Handle errors using the HTTP status code and show a safe message to the user.

| HTTP status | Typical meaning | Frontend action |
|---:|---|---|
| `400` | Missing input, both inputs supplied, invalid image type, empty text, or invalid creator hierarchy. | Ask the user to correct the input. |
| `401` | Missing or invalid JWT. | Ask the user to sign in again. |
| `403` | User role is not allowed. | Show an access-denied message. |
| `404` | Active task creator not found. | Show an error and contact support if it persists. |
| `413` | Image exceeds the upload size limit. | Ask the user to upload an image under 10 MB. |
| `502` | AI service failed or returned an invalid response. | Show a retry message; retain the user's input if possible. |
| `503` | Python AI service is unavailable. | Show a temporary service-unavailable message. |

## Recommended frontend behavior

1. Let the supervisor choose **Upload screenshot** or **Paste email text**.
2. Send one request to `POST /api/tasks/intake` using the matching body format.
3. Show loading/progress feedback while AI extraction and recommendations run.
4. Render each item in `proposals` with its task text, prediction, reason, deadline, and recommendation.
5. Let the supervisor review/edit the proposal and select the intended employee.
6. Use `analysisId` and `proposalId` for the subsequent workflow endpoints.

### Next workflow endpoints

After intake succeeds, the current controller also provides:

- `GET /api/tasks/intake/:id` — retrieve the saved intake.
- `POST /api/tasks/intake/:analysisId/proposals/:proposalId/recommend` — request a recommendation for a proposal.
- `POST /api/tasks/intake/:analysisId/proposals/:proposalId/draft` — create the task and email draft after supervisor review.
- `POST /api/tasks/intake/:analysisId/proposals/:proposalId/draft-and-confirm` — create the task and email draft, then automatically confirm dispatch in the same workflow.
- `POST /api/tasks/email-drafts/:id/confirm-sent` — legacy/manual confirmation endpoint; not needed by the combined development workflow.

### Draft and automatic confirmation

**Method:** `POST`

**URL:** `/api/tasks/intake/:analysisId/proposals/:proposalId/draft-and-confirm`

This endpoint combines draft creation and dispatch confirmation into one request. It saves the task and email draft, creates the dispatch record, links the task to the dispatch, updates the task status to `DISPATCHED`, records `activatedAt`, and marks the email draft as `SENT`.

The request body uses the same fields as the existing `draft` endpoint. Example:

```json
{
  "assigneeId": "employee-uuid",
  "title": "Prepare the monthly report",
  "description": "Prepare and submit the monthly report.",
  "deadline": "2026-11-05T15:00:00.000Z",
  "emailSubject": "New Task Assignment",
  "emailBody": "Please prepare and submit the monthly report by the deadline."
}
```

The IDs and values are illustrative. Include the JWT Bearer token and use an allowed supervisor role, as with the other workflow endpoints.

**Automatic-confirmation limitation:** This currently confirms the dispatch in the database only; it does **not** send an actual email. The draft may be marked `SENT` and the task `DISPATCHED` even though no message was delivered. Treat this as a development-only simulation. Before production use, integrate Microsoft Outlook / Microsoft Graph and only record successful dispatch after the send request is accepted. The old `/confirm-sent` endpoint remains available unless it is explicitly removed from the controller.

These endpoints also require the JWT and an allowed supervisor role. See the backend controller/service for the exact request body for draft creation and email confirmation.

## Backward-compatible routes

The backend currently maps these routes to the same intake handler:

- `POST /api/tasks/intake`
- `POST /api/tasks/intake/process`
- `POST /api/tasks/intake/image`

For new frontend work, use `POST /api/tasks/intake` for both input types.

test
