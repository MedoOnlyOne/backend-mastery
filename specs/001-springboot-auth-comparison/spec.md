# Feature Specification: JWT Auth Server Reimplementation & Framework Comparison

**Feature Branch**: `001-springboot-auth-comparison`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "in playground2 we have a simple auth server using express js with JWT, we need a playground3 to do the same task with springboot and compare the diff between 2 frameworks"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration (Priority: P1)

A new user wants to create an account by providing an email and password. The system validates the input, hashes the password, stores the user, and returns a success response with the registered email.

**Why this priority**: Registration is the foundation — no other auth flow works without registered users. This is the entry point for the entire system.

**Independent Test**: Can be fully tested by sending a POST request with email and password, and verifying the user is stored. Delivers the ability to create accounts.

**Acceptance Scenarios**:

1. **Given** no user exists with the provided email, **When** a registration request is submitted with valid email and password, **Then** the system creates the account and returns the email with a 201 status
2. **Given** a user already exists with the provided email, **When** a registration request is submitted, **Then** the system rejects the request with an appropriate error message and 400 status
3. **Given** a registration request with missing email or password, **When** submitted, **Then** the system rejects it with a validation error

---

### User Story 2 - User Login with Token Issuance (Priority: P1)

A registered user wants to authenticate by providing email and password. Upon successful authentication, the system issues a short-lived access token and a long-lived refresh token.

**Why this priority**: Login is the core authentication mechanism — users need tokens to access protected resources. Paired with registration as the most critical flow.

**Independent Test**: Can be fully tested by registering a user first, then logging in with those credentials, and verifying two tokens are returned.

**Acceptance Scenarios**:

1. **Given** a registered user, **When** correct email and password are provided, **Then** the system returns an access token and a refresh token with a 200 status
2. **Given** invalid credentials, **When** login is attempted, **Then** the system rejects with an "Invalid credentials" error and 401 status
3. **Given** missing email or password, **When** login is attempted, **Then** the system rejects with a validation error

---

### User Story 3 - Access Token Refresh (Priority: P2)

A user whose access token has expired wants to obtain a new access token by presenting a valid refresh token, without needing to log in again.

**Why this priority**: Token refresh enables seamless user sessions. Important for usability but depends on login working first.

**Independent Test**: Can be tested by logging in to obtain a refresh token, waiting for or simulating access token expiry, then using the refresh token to get a new access token.

**Acceptance Scenarios**:

1. **Given** a valid refresh token, **When** a refresh request is submitted, **Then** the system returns a new access token with a 200 status
2. **Given** an invalid or expired refresh token, **When** a refresh request is submitted, **Then** the system rejects with an "Invalid token" error and 401 status
3. **Given** no token provided, **When** a refresh request is submitted, **Then** the system rejects with a validation error

---

### User Story 4 - Protected Profile Access (Priority: P2)

An authenticated user wants to view their profile information by presenting a valid access token in the Authorization header.

**Why this priority**: Demonstrates that the auth flow works end-to-end. Depends on login working (to get tokens).

**Independent Test**: Can be tested by logging in to get an access token, then calling the profile endpoint with that token.

**Acceptance Scenarios**:

1. **Given** a valid access token in the Authorization header, **When** the profile endpoint is called, **Then** the system returns the user's email with a 200 status
2. **Given** an invalid or expired access token, **When** the profile endpoint is called, **Then** the system rejects with an "Invalid token" error and 401 status
3. **Given** no access token provided, **When** the profile endpoint is called, **Then** the system rejects with an "Invalid token" error and 401 status

---

### User Story 5 - Framework Comparison Analysis (Priority: P3)

A developer wants to understand the key differences between the two framework implementations of the same auth system, covering areas such as project structure, dependency management, security handling, code verbosity, and developer experience.

**Why this priority**: The comparison is the learning objective of this exercise. It depends on both implementations being complete first.

**Independent Test**: Can be reviewed by reading the comparison document and verifying it covers all functional equivalents between the two implementations.

**Acceptance Scenarios**:

1. **Given** both implementations are complete, **When** the comparison is produced, **Then** it covers project structure, routing, middleware, data layer, security, and code organization
2. **Given** the comparison document, **When** reviewed, **Then** it highlights at least 5 meaningful differences with concrete code examples from both implementations

---

### Edge Cases

- What happens when a refresh token is reused after the access token is still valid?
- How does the system handle concurrent registration attempts with the same email?
- What happens when tokens are tampered with or malformed?
- How does the system behave when the in-memory store is empty and login is attempted?
- What happens when password hashing fails due to an invalid input (e.g., null password)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow new users to register with an email and password
- **FR-002**: System MUST reject duplicate email registrations with an appropriate error
- **FR-003**: System MUST validate that both email and password are provided for registration and login
- **FR-004**: System MUST hash passwords before storing them
- **FR-005**: System MUST authenticate users by verifying email/password credentials
- **FR-006**: System MUST issue a short-lived access token (1 minute expiry) upon successful login
- **FR-007**: System MUST issue a long-lived refresh token (1 hour expiry) alongside the access token
- **FR-008**: System MUST allow users to obtain a new access token by presenting a valid refresh token
- **FR-009**: System MUST reject invalid, expired, or missing refresh tokens
- **FR-010**: System MUST expose a protected endpoint that returns user profile data when a valid access token is provided
- **FR-011**: System MUST reject requests to protected endpoints with invalid, expired, or missing access tokens
- **FR-012**: System MUST store user data in-memory (no database required)
- **FR-013**: System MUST follow a layered architecture pattern (routes/controllers/services/repository)
- **FR-014**: The comparison MUST cover project structure, dependency management, security approach, code verbosity, and development workflow differences
- **FR-015**: The comparison MUST include side-by-side code examples for each key difference identified

### Key Entities

- **User**: Represents a registered user with an email (unique identifier) and a hashed password
- **Access Token**: A short-lived token (1 minute) used to authorize requests to protected endpoints, containing the user's email
- **Refresh Token**: A long-lived token (1 hour) used to obtain new access tokens without re-authentication, containing the user's email

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four API endpoints (register, login, refresh, profile) work identically to the existing Express implementation, accepting the same request shapes and returning the same response shapes
- **SC-002**: A user can complete the full authentication lifecycle (register, login, access profile, refresh token) without encountering errors
- **SC-003**: The comparison document identifies at least 5 meaningful framework differences, each supported by concrete code examples from both implementations
- **SC-004**: The new implementation maintains the same layered architecture pattern (routes, controllers, services, repository) enabling direct structural comparison

## Assumptions

- Users have Java 17+ and Maven or Gradle installed to run the new implementation
- The new implementation will live in a `playground3/` directory, following the existing project convention
- In-memory storage is acceptable for both implementations (no database required)
- Token secrets can be hardcoded for learning purposes (same approach as playground2)
- No HTTPS or production-grade security configuration is required — this is a learning exercise
- The comparison document can be a markdown file alongside the code
- Error handling should be consistent with playground2's approach (simple error messages, appropriate HTTP status codes)
- The API endpoints should use the same paths and HTTP methods as playground2 for easy comparison (e.g., POST /users/register, POST /users/login, POST /users/refresh, GET /users/me)
