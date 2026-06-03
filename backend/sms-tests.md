# SMS Provider API Tests

Here are the Postman test examples for the updated SMS platform APIs.

### 1. Send Single SMS
**Endpoint:** `POST /api/sms/send`
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "mobile": "6395857663",
  "message": "Hello from internal platform!",
  "templateId": "optional-template-id"
}
```

**Expected Response (Mock):**
```json
{
  "id": 1,
  "mobile": "+916395857663",
  "message": "Hello from internal platform!",
  "status": "SENT",
  "provider": "mock",
  "providerMessageId": "MOCK_1717319400000_123",
  "createdAt": "2024-06-02T10:00:00.000Z",
  "campaignId": null,
  "contactId": null
}
```

### 2. Send Bulk SMS
**Endpoint:** `POST /api/sms/bulk`
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "message": "Bulk message!",
  "contactIds": [1, 2, 3]
}
```

**Expected Response:**
```json
{
  "sent": 3
}
```

### 3. Send Campaign
**Endpoint:** `PATCH /api/campaigns/1/send`
**Headers:** `Authorization: Bearer <token>`

**Expected Response:**
```json
{
  "campaign": {
    "id": 1,
    "name": "Test Campaign",
    "status": "SENT",
    "sentAt": "2024-06-02T10:00:00.000Z"
  },
  "sent": 3
}
```
