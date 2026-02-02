# Alora API Documentation

**Version:** 1.0.0  
**Last Updated:** 2026-02-01  
**Base URL:** `https://agreeable-dog-591.convex.cloud`

## Overview

Alora uses [Convex](https://convex.dev) as its backend platform. The API consists of:

- **Queries** - Read operations (real-time subscriptions supported)
- **Mutations** - Write operations (create, update, delete)
- **Actions** - Side effects (HTTP requests, scheduled jobs)

## Authentication

All API requests require authentication via Clerk. The authentication token is automatically included when using the Convex React client with Clerk integration.

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Authenticated query
const user = useQuery(api.functions.users.index.get);
```

## Organization Scoping

All data is scoped to organizations (families). The API automatically filters data based on the authenticated user's organization membership. Users cannot access data from other organizations.

## Error Handling

### Common Error Codes

| Error                    | HTTP Status | Description                     |
| ------------------------ | ----------- | ------------------------------- |
| `Not authenticated`      | 401         | User is not logged in           |
| `Not authorized`         | 403         | User doesn't have permission    |
| `Not found`              | 404         | Resource doesn't exist          |
| `Organization not found` | 400         | User has no active organization |
| `Rate limit exceeded`    | 429         | Too many requests               |

### Error Response Format

```json
{
  "error": "Not authorized",
  "message": "Not authorized to view appointments for this organization"
}
```

---

## API Endpoints

### Users

#### `users.get`

**Type:** Query  
**Auth Required:** Yes  
**Description:** Get current authenticated user

**Response:**

```json
{
  "_id": "user_123",
  "clerkUserId": "user_clerk_123",
  "clerkOrganizationId": "org_123",
  "email": "user@example.com",
  "name": "Jane Doe",
  "avatarUrl": "https://...",
  "createdAt": 1700000000000,
  "lastActiveAt": 1700000000000
}
```

#### `users.list`

**Type:** Query  
**Auth Required:** Yes  
**Description:** List all users in current organization

**Response:** Array of user objects

#### `users.exportUserData`

**Type:** Query  
**Auth Required:** Yes  
**Description:** Export all user data for GDPR compliance

**Response:** Complete data export including babies, tracking data, journal, etc.

---

### Babies

#### `babies.listByOrganization`

**Type:** Query  
**Auth Required:** Yes  
**Description:** List all babies in current organization

**Response:**

```json
[
  {
    "_id": "baby_123",
    "clerkOrganizationId": "org_123",
    "name": "Emma",
    "birthDate": 1700000000000,
    "gender": "female",
    "photoUrl": "https://...",
    "createdAt": 1700000000000
  }
]
```

#### `babies.getById`

**Type:** Query  
**Auth Required:** Yes  
**Args:** `{ babyId: Id<"babies"> }`  
**Description:** Get a specific baby by ID

#### `babies.create`

**Type:** Mutation  
**Auth Required:** Yes  
**Args:**

```json
{
  "name": "Emma",
  "birthDate": 1700000000000,
  "gender": "female" | "male" | "other",
  "photoUrl": "https://..." // optional
}
```

#### `babies.update`

**Type:** Mutation  
**Auth Required:** Yes  
**Args:** `{ babyId, name?, birthDate?, gender?, photoUrl? }`

---

### Feeds

#### `feeds.listFeeds`

**Type:** Query  
**Auth Required:** Yes  
**Args:** `{ babyId: Id<"babies">, limit?: number }`  
**Description:** List feeding records for a baby

**Response:**

```json
[
  {
    "_id": "feed_123",
    "babyId": "baby_123",
    "type": "breast" | "formula" | "solid",
    "side": "left" | "right" | "both", // for breast
    "amount": "120ml", // optional
    "duration": 900000, // milliseconds, optional
    "startTime": 1700000000000,
    "endTime": 1700000900000,
    "notes": "...",
    "createdById": "user_123"
  }
]
```

#### `feeds.createFeed`

**Type:** Mutation  
**Args:** `{ babyId, type, side?, amount?, duration?, startTime, endTime?, notes? }`

#### `feeds.updateFeed`

**Type:** Mutation  
**Args:** `{ feedId, ...updates }`

#### `feeds.deleteFeed`

**Type:** Mutation  
**Args:** `{ feedId }`

#### `feeds.getFeed`

**Type:** Query  
**Args:** `{ feedId }`

---

### Diapers

#### `diapers.listDiapers`

**Type:** Query  
**Args:** `{ babyId, limit? }`  
**Description:** List diaper change records

**Response:**

```json
[
  {
    "_id": "diaper_123",
    "babyId": "baby_123",
    "type": "wet" | "solid" | "both" | "mixed",
    "color": "yellow" | "orange" | "green" | "brown" | "red",
    "notes": "...",
    "startTime": 1700000000000,
    "createdById": "user_123"
  }
]
```

#### `diapers.createDiaper`

**Type:** Mutation  
**Args:** `{ babyId, type, color?, notes?, startTime }`

#### `diapers.updateDiaper`

**Type:** Mutation  
**Args:** `{ diaperId, ...updates }`

#### `diapers.deleteDiaper`

**Type:** Mutation  
**Args:** `{ diaperId }`

---

### Sleep

#### `sleep.listSleep`

**Type:** Query  
**Args:** `{ babyId, limit? }`

**Response:**

```json
[
  {
    "_id": "sleep_123",
    "babyId": "baby_123",
    "type": "nap" | "night" | "day",
    "startTime": 1700000000000,
    "endTime": 1700003600000,
    "duration": 3600000,
    "quality": "awake" | "drowsy" | "sleeping" | "deep",
    "notes": "...",
    "createdById": "user_123"
  }
]
```

#### `sleep.createSleep`

**Type:** Mutation  
**Args:** `{ babyId, type, startTime, endTime?, duration?, quality?, notes? }`

#### `sleep.updateSleep`

**Type:** Mutation  
**Args:** `{ sleepId, ...updates }`

#### `sleep.deleteSleep`

**Type:** Mutation  
**Args:** `{ sleepId }`

---

### Growth

#### `growth.list`

**Type:** Query  
**Args:** `{ babyId }`

**Response:**

```json
[
  {
    "_id": "growth_123",
    "babyId": "baby_123",
    "type": "weight" | "length" | "head_circumference",
    "value": 7.5,
    "unit": "kg",
    "date": "2024-01-15",
    "percentile": 75,
    "notes": "..."
  }
]
```

#### `growth.create`

**Type:** Mutation  
**Args:** `{ babyId, type, value, unit, date, notes? }`

#### `growth.update`

**Type:** Mutation  
**Args:** `{ growthId, value?, unit?, date?, notes? }`

---

### Milestones

#### `milestones.list`

**Type:** Query  
**Args:** `{ babyId }`

**Response:**

```json
[
  {
    "_id": "milestone_123",
    "babyId": "baby_123",
    "title": "First smile",
    "description": "...",
    "category": "motor" | "cognitive" | "language" | "social" | "custom",
    "date": "2024-01-15",
    "isCelebrated": true,
    "isCustom": false,
    "photoUrl": "https://..."
  }
]
```

#### `milestones.create`

**Type:** Mutation  
**Args:** `{ babyId, title, description?, category, date?, isCustom?, photoUrl? }`

#### `milestones.update`

**Type:** Mutation  
**Args:** `{ milestoneId, ...updates }`

---

### Journal

#### `journal.listJournal`

**Type:** Query  
**Args:** `{ startDate?, endDate?, tags?, limit? }`

**Response:**

```json
[
  {
    "_id": "journal_123",
    "userId": "user_123",
    "title": "Gratitude entry",
    "content": "Today I'm grateful for...",
    "mood": "great" | "good" | "okay" | "low" | "struggling",
    "tags": ["gratitude", "sleep"],
    "isGratitude": true,
    "isWin": false,
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  }
]
```

#### `journal.createJournal`

**Type:** Mutation  
**Args:** `{ title?, content, mood?, tags?, babyId?, isGratitude?, isWin? }`

#### `journal.updateJournal`

**Type:** Mutation  
**Args:** `{ id, title?, content?, mood?, tags? }`

#### `journal.deleteJournal`

**Type:** Mutation  
**Args:** `{ id }`

---

### Wellness / Mood

#### `wellness.createMood`

**Type:** Mutation  
**Args:** `{ babyId?, mood, energy?, anxiety?, notes?, tags? }`

**Response:**

```json
{
  "_id": "mood_123",
  "userId": "user_123",
  "babyId": "baby_123",
  "mood": "great",
  "energy": "high",
  "anxiety": false,
  "notes": "Feeling energized today",
  "tags": ["exercise", "sleep"],
  "createdAt": 1700000000000
}
```

#### `wellness.listMood`

**Type:** Query  
**Args:** `{ limit? }`

#### `wellness.getMoodTrends`

**Type:** Query  
**Args:** `{ days?: number }`  
**Description:** Get mood statistics over time

---

### Appointments

#### `appointments.listAppointments`

**Type:** Query  
**Args:** `{ clerkOrganizationId, babyId?, startDate?, endDate? }`

**Response:**

```json
[
  {
    "_id": "apt_123",
    "clerkOrganizationId": "org_123",
    "babyId": "baby_123",
    "title": "6-month checkup",
    "type": "pediatrician" | "checkup" | "vaccine" | "wellness" | "custom",
    "date": "2024-02-15",
    "time": "10:00",
    "location": "Children's Hospital",
    "notes": "Bring vaccination card",
    "isCompleted": false,
    "isRecurring": false,
    "createdAt": 1700000000000
  }
]
```

#### `appointments.createAppointment`

**Type:** Mutation  
**Args:** `{ babyId?, title, type, date, time, location?, notes?, isRecurring?, recurringInterval?, reminderMinutesBefore? }`

#### `appointments.updateAppointment`

**Type:** Mutation  
**Args:** `{ appointmentId, title?, date?, time?, location?, notes?, isCompleted? }`

#### `appointments.deleteAppointment`

**Type:** Mutation  
**Args:** `{ appointmentId }`

#### `appointments.completeAppointment`

**Type:** Mutation  
**Args:** `{ appointmentId }`

---

### Medications

#### `medications.listMedications`

**Type:** Query  
**Args:** `{ clerkOrganizationId, babyId?, isActive? }`

**Response:**

```json
[
  {
    "_id": "med_123",
    "clerkOrganizationId": "org_123",
    "babyId": "baby_123",
    "name": "Vitamin D drops",
    "type": "prescription" | "otc" | "supplement",
    "dosage": "1 drop",
    "frequency": "daily",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "notes": "Give with breakfast",
    "isActive": true,
    "reminderEnabled": true,
    "reminderTimes": ["08:00"]
  }
]
```

#### `medications.createMedication`

**Type:** Mutation  
**Args:** `{ babyId?, name, type, dosage?, frequency?, startDate, endDate?, notes?, reminderEnabled?, reminderTimes? }`

#### `medications.updateMedication`

**Type:** Mutation  
**Args:** `{ medicationId, name?, dosage?, frequency?, isActive?, notes? }`

---

### Reminders

#### `reminders.list`

**Type:** Query  
**Args:** `{ babyId? }`

#### `reminders.create`

**Type:** Mutation  
**Args:** `{ babyId, type, title, message?, intervalMinutes?, specificTime?, daysOfWeek?, isEnabled? }`

#### `reminders.update`

**Type:** Mutation  
**Args:** `{ reminderId, ...updates }`

---

### Families

#### `families.get`

**Type:** Query  
**Description:** Get family by user membership

#### `families.getByClerkOrganizationId`

**Type:** Query  
**Args:** `{ clerkOrganizationId }`

#### `families.updateSettings`

**Type:** Mutation  
**Args:** `{ settings: { premiumPlan?, premiumExpiry? } }`

---

## Real-time Subscriptions

Convex supports real-time subscriptions. When data changes, clients receive updates automatically.

```typescript
// Subscribe to real-time updates
const feeds = useQuery(api.functions.feeds.index.listFeeds, { babyId });

// feeds will automatically update when new feed records are added
```

## Rate Limiting

API endpoints are rate-limited per user:

| Category       | Limit        | Window   |
| -------------- | ------------ | -------- |
| Authentication | 5 requests   | 1 minute |
| Mutations      | 100 requests | 1 minute |
| Queries        | 200 requests | 1 minute |
| Webhooks       | 60 requests  | 1 minute |

## Data Retention

See [Data Retention Policy](./DATA_RETENTION_POLICY.md) for information on:

- Activity logs: 1 year
- User content: 1 year
- Rate limits: 24 hours
- Deleted accounts: 30 days grace period

## Security

- All data encrypted at rest (AES-256)
- TLS 1.3 for all connections
- Organization-scoped data isolation
- Input sanitization on all mutations
- HIPAA-compliant error tracking

## Client Libraries

### React / React Native

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Query
const data = useQuery(api.functions.babies.index.listByOrganization);

// Mutation
const createBaby = useMutation(api.functions.babies.index.create);
await createBaby({ name: "Emma", birthDate: Date.now(), gender: "female" });
```

### HTTP API (for external integrations)

```bash
curl https://your-deployment.convex.cloud/api/functions/babies/index/listByOrganization \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Support

For API questions or issues:

- Documentation: https://docs.convex.dev
- Convex Discord: https://convex.dev/community
- Alora Support: support@alora.app
