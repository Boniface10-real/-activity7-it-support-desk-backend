# Activity 7 Verification Checklist

Use the API client with `baseUrl = http://localhost:3000` locally, or your hosted HTTPS URL after deployment.

| Test | Request | Expected |
|---|---|---|
| API guide | GET `/` | 200 |
| Database health | GET `/health` | 200 and database connected |
| List records | GET `/api/records` | 200 JSON array |
| Create | POST `/api/records` with all four valid fields | 201 and returned id |
| Read created row | GET `/api/records/{id}` | 200, same record |
| Update | PUT `/api/records/{id}` with all four fields | 200, same id and changed values |
| Delete | DELETE `/api/records/{id}` | 200 and exact success message |
| Confirm deletion | GET `/api/records/{id}` | 404 |
| Invalid status | POST with status `Done` | 400 |
| Missing field | POST without `title` | 400 |
| Invalid ID | GET `/api/records/abc` | 400 |
| Missing row | GET/PUT/DELETE a positive unused ID | 404 |
| Unknown route | GET `/not-a-route` | 404 JSON |
| Malformed JSON | Send invalid JSON body | 400 |
| Persistence | Restart API, then GET a saved record | Record remains |

For POST and PUT, use:
```json
{
  "title": "Cannot connect to campus Wi-Fi",
  "category": "Network",
  "description": "My laptop cannot connect to the campus wireless network.",
  "status": "Pending"
}
```
