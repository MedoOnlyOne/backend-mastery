# Quickstart: Spring Security Integration

**Feature**: 002-spring-security | **Date**: 2026-04-11

## Prerequisites

- Java 17+
- Maven (or Maven wrapper)

## Setup

No additional setup beyond the existing playground3 project. The Spring Security starter will be added as a dependency.

## Running the Server

```bash
cd playground3
./mvnw spring-boot:run
# or: mvn spring-boot:run
```

Server starts on `http://localhost:8080`.

## Testing the API

### Register a new user

```bash
curl -X POST http://localhost:8080/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:8080/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save the `accessToken` and `refreshToken` from the response.

### Access protected profile

```bash
curl http://localhost:8080/users/me \
  -H "Authorization: Bearer <access-token>"
```

### Refresh access token

```bash
curl -X POST http://localhost:8080/users/refresh \
  -H "Content-Type: application/json" \
  -d '{"token":"<refresh-token>"}'
```

### Verify security enforcement (should return 401)

```bash
curl http://localhost:8080/users/me
curl http://localhost:8080/users/me -H "Authorization: Bearer invalid-token"
```

## Expected Behavior After Integration

| Endpoint                 | Auth Required | Behavior Change |
|--------------------------|---------------|-----------------|
| POST /users/register     | No            | None            |
| POST /users/login        | No            | None            |
| POST /users/refresh      | No            | None            |
| GET /users/me            | Yes           | Enforced by Spring Security instead of custom filter |

All request/response formats remain identical. The only difference is which infrastructure component enforces authentication.
