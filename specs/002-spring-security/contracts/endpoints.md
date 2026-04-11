# API Contracts: Spring Security Integration

**Feature**: 002-spring-security | **Date**: 2026-04-11

## Overview

All existing endpoint contracts are preserved unchanged. This document captures the complete API surface for reference during implementation.

## Public Endpoints (No Authentication Required)

### POST /users/register

Create a new user account.

**Request**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (201 Created):
```json
{
  "email": "string"
}
```

**Error** (400 Bad Request):
```json
{
  "message": "string"
}
```

---

### POST /users/login

Authenticate and obtain tokens.

**Request**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "string"
}
```

---

### POST /users/refresh

Obtain a new access token using a refresh token.

**Request**:
```json
{
  "token": "string"
}
```

**Response** (200 OK):
```json
{
  "newAccessToken": "string"
}
```

**Error** (400 Bad Request):
```json
{
  "message": "string"
}
```

---

## Protected Endpoints (Authentication Required)

### GET /users/me

Retrieve the authenticated user's profile.

**Request Headers**:
```
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "email": "string"
}
```

**Error** (401 Unauthorized) — returned by Spring Security's `AuthenticationEntryPoint`:
```json
{
  "message": "Invalid token"
}
```

---

## Error Response Contract

All error responses use the same JSON structure:

```json
{
  "message": "string"
}
```

| Source                    | HTTP Status | Trigger                          |
|---------------------------|-------------|----------------------------------|
| AuthenticationEntryPoint  | 401         | Missing/invalid/expired token    |
| GlobalExceptionHandler    | 401         | Invalid credentials (login)      |
| GlobalExceptionHandler    | 400         | Validation errors, bad requests  |
