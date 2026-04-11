# Feature Specification: Spring Security Integration

**Feature Branch**: `002-spring-security`
**Created**: 2026-04-11
**Status**: Draft
**Input**: User description: "in playground3 we have simple springboot auth server, now we need to use spring security for it"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Protected Profile Access via Security Framework (Priority: P1)

A registered user wants to access their profile information. The system must enforce authentication using the security framework rather than a custom servlet filter. Only requests with a valid access token should reach the protected endpoint, and the framework should handle token extraction and validation centrally.

**Why this priority**: This is the core value proposition — replacing the hand-rolled JwtAuthFilter with proper framework-managed security. Without this, the other stories have no foundation to build on.

**Independent Test**: Can be fully tested by registering a user, logging in to obtain tokens, and accessing the `/users/me` endpoint with and without a valid Bearer token. The security framework should reject unauthenticated requests with appropriate error responses.

**Acceptance Scenarios**:

1. **Given** the server is running and security is configured, **When** a request to `/users/me` includes a valid Bearer access token, **Then** the user's profile is returned successfully
2. **Given** the server is running, **When** a request to `/users/me` is sent without an Authorization header, **Then** the request is rejected with an authentication error
3. **Given** the server is running, **When** a request to `/users/me` includes an expired or invalid token, **Then** the request is rejected with an authentication error

---

### User Story 2 - Public Endpoint Access (Priority: P2)

A new or returning user wants to register an account, log in, or refresh their access token. These operations must remain publicly accessible without any authentication requirement, even after the security framework is integrated.

**Why this priority**: Registration, login, and token refresh are prerequisites for all other flows. If these break during the security integration, the entire system becomes unusable.

**Independent Test**: Can be fully tested by calling `/users/register`, `/users/login`, and `/users/refresh` without any authentication token and verifying they respond correctly as before.

**Acceptance Scenarios**:

1. **Given** the server is running with security configured, **When** a new user submits registration details to `/users/register`, **Then** the account is created successfully without requiring authentication
2. **Given** a registered user, **When** login credentials are submitted to `/users/login`, **Then** access and refresh tokens are returned without requiring authentication
3. **Given** a valid refresh token, **When** it is submitted to `/users/refresh`, **Then** a new access token is returned without requiring authentication

---

### User Story 3 - Centralized Error Responses (Priority: P3)

A client sending requests to the server receives consistent, well-structured error responses for all security-related failures (missing token, invalid token, expired token). The error format matches the existing application-wide error handling pattern.

**Why this priority**: Consistent error responses improve client-side error handling and debugging. This completes the security integration by ensuring the framework's error handling aligns with the existing API contract.

**Independent Test**: Can be fully tested by sending various invalid requests (missing token, malformed token, expired token) and verifying the response body format and status codes are consistent.

**Acceptance Scenarios**:

1. **Given** the server is running, **When** an unauthenticated request hits a protected endpoint, **Then** the response includes a JSON body with a clear error message and an appropriate HTTP status code
2. **Given** the server is running, **When** a request with a malformed token hits a protected endpoint, **Then** the response uses the same JSON error format as other application errors

---

### Edge Cases

- What happens when a token expires between the time the security filter validates it and the controller processes the request?
- How does the system handle requests with a valid-looking but tampered token (wrong signature)?
- What happens if the Authorization header contains a scheme other than "Bearer" (e.g., "Basic")?
- How does the system behave when concurrent requests use the same token?
- What happens when a request includes extra whitespace or unusual formatting in the Authorization header?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST enforce authentication on protected endpoints using a centralized security framework instead of a custom servlet filter
- **FR-002**: The system MUST allow unauthenticated access to public endpoints (register, login, refresh)
- **FR-003**: The system MUST extract and validate Bearer tokens from the Authorization header as part of the security framework's request processing pipeline
- **FR-004**: The system MUST make the authenticated user's identity (email) available to controllers through the security context
- **FR-005**: The system MUST return consistent JSON error responses for all security-related failures (unauthenticated, invalid token)
- **FR-006**: The system MUST preserve the existing dual-token flow (access token + refresh token) with the same token characteristics (expiration times, signing)
- **FR-007**: The system MUST preserve all existing endpoint paths, request/response formats, and HTTP status codes
- **FR-008**: The system MUST disable framework-default behaviors that conflict with the custom JWT approach (form login, session management, CSRF)

### Key Entities

- **User**: A registered individual identified by email with a hashed password. Retained from the existing system with no schema changes.
- **Access Token**: A short-lived token (1 minute) that grants access to protected endpoints, signed with a secret key
- **Refresh Token**: A long-lived token (1 hour) used to obtain new access tokens, signed with a separate secret key

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All existing API endpoints function identically after the security framework integration — same request formats, same response formats, same status codes
- **SC-002**: Unauthenticated requests to protected endpoints are rejected consistently with a structured error response, achieving 100% rejection rate
- **SC-003**: The security configuration is centralized in a single configuration unit, replacing the previous custom filter registration approach
- **SC-004**: No custom servlet filter code remains in the codebase for authentication — all auth logic is handled by the security framework
- **SC-005**: Registration, login, and token refresh flows complete without any authentication prerequisite

## Assumptions

- The existing dual-token (access + refresh) architecture and token characteristics (secrets, expiration) will be preserved as-is
- In-memory user storage (ArrayList) will continue to be used — no database migration
- The JWT library currently in use (JJWT) will continue to be used for token creation and verification
- This is an educational project aimed at learning how to integrate a security framework into an existing application
- No role-based or permission-based access control is needed — authentication alone is sufficient
- No HTTPS/TLS configuration changes are in scope
- The existing global exception handler will be retained and may be extended for security-specific errors
