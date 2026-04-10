# Quickstart: Spring Boot JWT Auth Server (playground3)

**Feature**: 001-springboot-auth-comparison
**Date**: 2026-04-10

## Prerequisites

- Java 17+ (`java -version`)
- Maven 3.6+ (`mvn -version`)
- curl or HTTPie (for testing)

## Running the Server

```bash
cd playground3
mvn spring-boot:run
```

Server starts on port 8080 (Spring Boot default).

## API Endpoints

### Register

```bash
curl -X POST http://localhost:8080/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: `201 Created` — `{"email":"test@example.com"}`

### Login

```bash
curl -X POST http://localhost:8080/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: `200 OK` — `{"accessToken":"...","refreshToken":"..."}`

### Refresh Access Token

```bash
curl -X POST http://localhost:8080/users/refresh \
  -H "Content-Type: application/json" \
  -d '{"token":"<refresh-token>"}'
```

Expected: `200 OK` — `{"newAccessToken":"..."}`

### Get Profile (Protected)

```bash
curl http://localhost:8080/users/me \
  -H "Authorization: Bearer <access-token>"
```

Expected: `200 OK` — `{"email":"test@example.com"}`

## Comparing with playground2 (Express)

The API is identical in paths, methods, request/response shapes:

| Aspect | playground2 (Express) | playground3 (Spring Boot) |
|--------|----------------------|---------------------------|
| Port | 3000 | 8080 |
| Base path | /users/* | /users/* |
| Request format | JSON body | JSON body |
| Response format | JSON body | JSON body |
| Auth header | `Authorization: Bearer <token>` | `Authorization: Bearer <token>` |
