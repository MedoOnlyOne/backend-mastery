# Data Model: Spring Security Integration

**Feature**: 002-spring-security | **Date**: 2026-04-11

## Overview

No data model changes are required. The existing entities (User, Access Token, Refresh Token) are preserved as-is. This feature is a security infrastructure change, not a data model change.

## Existing Entities (Unchanged)

### User

| Field     | Type   | Constraints              |
|-----------|--------|--------------------------|
| email     | String | Unique identifier        |
| password  | String | BCrypt-hashed            |

- Storage: In-memory `ArrayList<User>`
- Identity: Email address (unique)
- Lifecycle: Created on registration, no update/delete operations

### Access Token

| Property       | Value                                   |
|----------------|-----------------------------------------|
| Subject        | User email                              |
| Expiration     | 1 minute                                |
| Signing        | HMAC-SHA with dedicated secret key      |
| Purpose        | Authorize access to protected endpoints |

### Refresh Token

| Property       | Value                                   |
|----------------|-----------------------------------------|
| Subject        | User email                              |
| Expiration     | 1 hour                                  |
| Signing        | HMAC-SHA with separate secret key       |
| Purpose        | Obtain new access tokens                |

## New Security Context Entity

### SecurityContext Principal (Runtime Only)

| Field       | Value                             |
|-------------|-----------------------------------|
| Principal   | User email (String)               |
| Credentials | null (already verified via JWT)   |
| Authorities | Empty list (no roles)             |

- This is a runtime construct in Spring Security's `SecurityContextHolder`
- Not persisted — created per-request by the JWT filter
- Available to controllers via `@AuthenticationPrincipal`
