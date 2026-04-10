# API Contracts: Spring Boot JWT Auth Server

**Feature**: 001-springboot-auth-comparison
**Date**: 2026-04-10

All endpoints are under the `/users` base path. Request and response bodies are JSON.

---

## POST /users/register

Register a new user account.

**Request**:

```json
{
  "email": "string (required, non-empty)",
  "password": "string (required, non-empty)"
}
```

**Responses**:

| Status | Body | Condition |
|--------|------|-----------|
| 201 | `{"email": "user@example.com"}` | New user created |
| 400 | `{"message": "User already exists"}` | Email already registered |
| 400 | `{"message": "Invalid email or password"}` | Missing email or password |

---

## POST /users/login

Authenticate and receive token pair.

**Request**:

```json
{
  "email": "string (required, non-empty)",
  "password": "string (required, non-empty)"
}
```

**Responses**:

| Status | Body | Condition |
|--------|------|-----------|
| 200 | `{"accessToken": "jwt...", "refreshToken": "jwt..."}` | Valid credentials |
| 401 | `{"message": "Invalid credentials"}` | Wrong email/password or missing fields |

---

## POST /users/refresh

Exchange a valid refresh token for a new access token.

**Request**:

```json
{
  "token": "string (required, valid refresh JWT)"
}
```

**Responses**:

| Status | Body | Condition |
|--------|------|-----------|
| 200 | `{"newAccessToken": "jwt..."}` | Valid refresh token |
| 401 | `{"message": "Invalid token"}` | Invalid, expired, or missing token |

---

## GET /users/me

Get the authenticated user's profile. Requires valid access token.

**Headers**:

```
Authorization: Bearer <access-token>
```

**Responses**:

| Status | Body | Condition |
|--------|------|-----------|
| 200 | `{"email": "user@example.com"}` | Valid access token |
| 401 | `{"message": "Invalid token"}` | Invalid, expired, or missing token |

---

## Token Specifications

| Property | Access Token | Refresh Token |
|----------|-------------|---------------|
| Payload | `{ email }` | `{ email }` |
| Expiry | 1 minute | 1 hour |
| Signing | HMAC-SHA with access secret | HMAC-SHA with refresh secret |
| Usage | `Authorization: Bearer` header | Request body `token` field |
