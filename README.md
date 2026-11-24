# ICT251 Activity 7 — IT Support Desk Backend

This folder contains a standalone Node.js + Express REST API using PostgreSQL. It implements the Activity 7 CRUD routes and validation requirements.

## 1. Before you start

Install:
- Node.js 18 or later (the installer includes npm)
- A PostgreSQL database (for example, a Render PostgreSQL database)
- Postman, Thunder Client, or another API client
- A GitHub account for hosting

**Database note:** Some introductory wording in the assignment refers to SQLite, while the specified install command and the detailed SQL examples use PostgreSQL (`pg`, `$1` placeholders and `RETURNING`). This project follows the PostgreSQL implementation. If your lecturer specifically requires SQLite, confirm before mixing database drivers.

## 2. Open the project

1. Extract the ZIP file.
2. Open the extracted `Activity7_Backend` folder in VS Code.
3. Open VS Code Terminal (PowerShell).
4. Confirm the terminal is inside the folder containing `package.json`:
   ```powershell
   dir
   ```

## 3. Install dependencies

Run:
```powershell
npm install
```
If PowerShell blocks `npm`, run:
```powershell
npm.cmd install
```

## 4. Configure PostgreSQL

1. Create a PostgreSQL database.
2. Copy `.env.example` and name the copy `.env`.
3. Put the database connection URL in `DATABASE_URL`.
4. Set `STUDENT_NUMBER` to your own student number.
5. Set `PUBLIC_BASE_URL` to your deployed URL after deployment. Locally it can be left blank.
6. Do not send anyone your `.env` file, password, or full database URL. Do not upload `.env` to GitHub.

For local development, use the database provider's external connection URL. In Render, configure the web service with the database's internal connection URL when both services are in the same Render region.

## 5. Start and verify locally

Run:
```powershell
npm start
```
The API should print a message saying it is running. Keep this terminal open while testing.

Open these URLs in a browser:
- `http://localhost:3000/`
- `http://localhost:3000/health`
- `http://localhost:3000/api/records`

Expected:
- `/` returns the API guide as JSON.
- `/health` returns HTTP 200 with `{"status":"ok","database":"connected"}`.
- `/api/records` returns a JSON array. The first run inserts sample records.

## 6. API routes

| Method | Endpoint | Expected result |
|---|---|---|
| GET | `/` | API guide, 200 |
| GET | `/health` | Database health, 200 or 503 |
| GET | `/api/records` | Array of records, 200 |
| GET | `/api/records/:id` | One record, 200; missing record, 404 |
| POST | `/api/records` | New record, 201 |
| PUT | `/api/records/:id` | Updated record, 200; missing record, 404 |
| DELETE | `/api/records/:id` | `{"message":"Record deleted."}`, 200; missing record, 404 |

### POST and PUT JSON body

Send all four fields for both POST and PUT. Do not include `id`; the database generates it.

```json
{
  "title": "Cannot connect to campus Wi-Fi",
  "category": "Network",
  "description": "My laptop cannot connect to the campus wireless network.",
  "status": "Pending"
}
```

Validation:
- `title`: 3–80 characters
- `category`: 2–40 characters
- `description`: 5–300 characters
- `status`: exactly `Pending`, `In progress`, or `Completed`
- Values must be strings and cannot be blank.
- IDs must be positive whole numbers.
- Invalid input / malformed JSON: 400
- Missing record or route: 404
- Unexpected server failure: 500

## 7. Test in this order

1. `GET /health`
2. `GET /api/records`
3. `POST /api/records` with the sample JSON above; save the returned `id`.
4. `GET /api/records/ID` using the returned ID.
5. `PUT /api/records/ID` with all four fields and at least one changed value.
6. `DELETE /api/records/ID`.
7. `GET /api/records/ID` again; expect 404.
8. Try invalid POST data (for example, an unknown status); expect 400.
9. Try `/api/records/abc`; expect 400.
10. Restart the server and confirm your records remain in PostgreSQL.

The included `Activity7.postman_collection.json` has the route requests. Import it into Postman and set the `baseUrl` collection variable to `http://localhost:3000`. For the create/get/update/delete sequence, copy the returned record ID into the `recordId` variable.

## 8. Deploy to Render

1. Create a GitHub repository for this backend.
2. Upload the extracted project files. Include `package.json` and the generated `package-lock.json`.
3. Confirm `.env` and `node_modules` are not uploaded.
4. Create a Render **Web Service** connected to the repository.
5. Set:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables in Render:
   - `DATABASE_URL`: your Render PostgreSQL database's internal connection URL
   - `NODE_ENV`: `production`
   - `STUDENT_NUMBER`: your student number
   - `PUBLIC_BASE_URL`: your Render HTTPS service URL
   - `CLIENT_ORIGINS`: only if you have a frontend origin to allow
7. Deploy and inspect the logs.
8. Test the hosted `/health`, then every CRUD route using Postman and your hosted base URL.

Do not put database passwords in source code, screenshots, GitHub, or messages. Render's free web services may sleep while idle, so the first request can take time. Use a hosted PostgreSQL database for persistent records; files on a web service's local disk may not persist across redeploys.

## 9. Submission checklist

- [ ] API runs locally.
- [ ] All required routes work.
- [ ] Input validation and required status codes work.
- [ ] Records persist after restarting the server.
- [ ] Hosted `/health` reports the database connected.
- [ ] All CRUD routes tested against the hosted API.
- [ ] GET `/` API guide includes your student number and live base URL.
- [ ] GitHub repository excludes `.env` and `node_modules`.
- [ ] Live API base URL is ready to submit.

## Important

This ZIP is a prepared project, not proof that your database is configured, the API has run on your computer, or the service has been deployed. Complete the setup and testing steps above, and verify each result before submission.
