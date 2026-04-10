# Data Model: Spring Boot JWT Auth Server

**Feature**: 001-springboot-auth-comparison
**Date**: 2026-04-10

## Entities

### User

Represents a registered user in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| email | String | Required, unique, non-empty | Unique identifier and login credential |
| password | String | Required, non-empty | BCrypt-hashed password (never stored in plain text) |

**Identity rule**: Email is the sole unique key. No numeric ID.

**Storage**: In-memory list (Java `ArrayList`), mirroring playground2's `exports.users = []`.

**State transitions**:
- Created → on successful registration (email + hashed password added to list)
- No update or delete operations in scope

**Validation rules**:
- Email must be non-null and non-empty
- Password must be non-null and non-empty
- Email must not already exist in the store

### Access Token (transient, not persisted)

| Field | Type | Description |
|-------|------|-------------|
| subject | String | User's email |
| issuedAt | Date | Token creation timestamp |
| expiration | Date | 1 minute from issuedAt |
| algorithm | HMAC-SHA | Signed with access secret key |

**Lifecycle**: Created on login, verified on each protected request, expires after 1 minute.

### Refresh Token (transient, not persisted)

| Field | Type | Description |
|-------|------|-------------|
| subject | String | User's email |
| issuedAt | Date | Token creation timestamp |
| expiration | Date | 1 hour from issuedAt |
| algorithm | HMAC-SHA | Signed with refresh secret key |

**Lifecycle**: Created on login, verified on refresh request, expires after 1 hour. Not stored server-side (stateless, same as playground2).

## Relationships

- User → Access Token: 1-to-many (one user can have multiple access tokens over time)
- User → Refresh Token: 1-to-many (one user can have multiple refresh tokens over time)
- Access Token and Refresh Token are both self-contained (JWT) with no server-side storage
