# Tasks: Spring Boot JWT Auth Server & Framework Comparison

**Input**: Design documents from `/specs/001-springboot-auth-comparison/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No test framework configured (consistent with existing playgrounds). No test tasks included.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Spring Boot scaffolding

- [ ] T001 Create playground3/ directory with Maven pom.xml (Spring Boot 3.5.6, spring-boot-starter-web, JJWT 0.13.0, spring-security-crypto) in `playground3/pom.xml`
- [ ] T002 Create Spring Boot entry point in `playground3/src/main/java/com/example/playground3/Playground3Application.java`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components shared across ALL user stories — MUST complete before any user story work begins

- [ ] T003 [P] Create User model (email + password fields, constructor, getters) in `playground3/src/main/java/com/example/playground3/model/User.java`
- [ ] T004 [P] Create HashUtil (BCrypt encode + matches using BCryptPasswordEncoder) in `playground3/src/main/java/com/example/playground3/util/HashUtil.java`
- [ ] T005 [P] Create JwtUtil (createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken using JJWT with hardcoded secrets, 1min/1h expiry) in `playground3/src/main/java/com/example/playground3/util/JwtUtil.java`
- [ ] T006 Create UserRepository (in-memory ArrayList, findUserByEmail, createUser) in `playground3/src/main/java/com/example/playground3/repository/UserRepository.java`

**Checkpoint**: Foundation ready — User model, repository, JWT utility, and hash utility all in place

---

## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: New users can register with email and password, receiving a 201 response with their email

**Independent Test**: `curl -X POST http://localhost:8080/users/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'` → 201 `{"email":"test@example.com"}`

### Implementation for User Story 1

- [ ] T007 [US1] Implement registerUser method in UserService (validate input, check duplicate email, hash password, save user) in `playground3/src/main/java/com/example/playground3/service/UserService.java`
- [ ] T008 [US1] Create UserController with POST /users/register endpoint mapping, delegating to UserService in `playground3/src/main/java/com/example/playground3/controller/UserController.java`
- [ ] T009 [US1] Add global exception handler for validation and duplicate-email errors returning 400 status with JSON error message in `playground3/src/main/java/com/example/playground3/controller/GlobalExceptionHandler.java`

**Checkpoint**: Registration works end-to-end — user can register, duplicate emails are rejected with 400

---

## Phase 4: User Story 2 - User Login with Token Issuance (Priority: P1)

**Goal**: Registered users can authenticate and receive access + refresh token pair

**Independent Test**: Register a user, then `curl -X POST http://localhost:8080/users/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'` → 200 `{"accessToken":"...","refreshToken":"..."}`

### Implementation for User Story 2

- [ ] T010 [US2] Add login method to UserService (validate credentials, verify password, generate access + refresh tokens via JwtUtil) in `playground3/src/main/java/com/example/playground3/service/UserService.java`
- [ ] T011 [US2] Add POST /users/login endpoint to UserController, returning token pair with 200 or 401 on failure in `playground3/src/main/java/com/example/playground3/controller/UserController.java`

**Checkpoint**: Login works end-to-end — valid credentials return token pair, invalid credentials return 401

---

## Phase 5: User Story 3 - Access Token Refresh (Priority: P2)

**Goal**: Users with expired access tokens can get new ones using their refresh token

**Independent Test**: Login to get refresh token, then `curl -X POST http://localhost:8080/users/refresh -H "Content-Type: application/json" -d '{"token":"<refresh-token>"}'` → 200 `{"newAccessToken":"..."}`

### Implementation for User Story 3

- [ ] T012 [US3] Add generateAccessToken method to UserService (verify refresh token, issue new access token) in `playground3/src/main/java/com/example/playground3/service/UserService.java`
- [ ] T013 [US3] Add POST /users/refresh endpoint to UserController, accepting `{"token":"..."}` body and returning new access token or 401 in `playground3/src/main/java/com/example/playground3/controller/UserController.java`

**Checkpoint**: Token refresh works — valid refresh token returns new access token, invalid token returns 401

---

## Phase 6: User Story 4 - Protected Profile Access (Priority: P2)

**Goal**: Authenticated users can view their profile by presenting a valid access token

**Independent Test**: Login to get access token, then `curl http://localhost:8080/users/me -H "Authorization: Bearer <access-token>"` → 200 `{"email":"test@example.com"}`

### Implementation for User Story 4

- [ ] T014 [US4] Create JwtAuthFilter servlet filter (extract Authorization Bearer header, verify access token via JwtUtil, set userEmail as request attribute, return 401 on failure) in `playground3/src/main/java/com/example/playground3/config/JwtAuthFilter.java`
- [ ] T015 [US4] Add getProfile method to UserService (verify access token, return user by email from repository) in `playground3/src/main/java/com/example/playground3/service/UserService.java`
- [ ] T016 [US4] Add GET /users/me endpoint to UserController, reading token from Authorization header and delegating to UserService in `playground3/src/main/java/com/example/playground3/controller/UserController.java`
- [ ] T017 [US4] Register JwtAuthFilter as a Spring Bean with FilterRegistrationBean, mapped to /users/me only in `playground3/src/main/java/com/example/playground3/config/FilterConfig.java`

**Checkpoint**: Profile access works — valid token returns user email, invalid/missing token returns 401. All 4 endpoints functional.

---

## Phase 7: User Story 5 - Framework Comparison Analysis (Priority: P3)

**Goal**: Developer can understand key differences between Express and Spring Boot implementations with code examples

**Independent Test**: Read COMPARISON.md and verify it covers project structure, routing, middleware, data layer, security, and code organization with 5+ differences

### Implementation for User Story 5

- [ ] T018 [US5] Create COMPARISON.md covering: (1) project structure & bootstrapping, (2) dependency management (pom.xml vs package.json), (3) routing (annotations vs Router), (4) middleware/filters, (5) data layer patterns, with side-by-side code examples from playground2 and playground3 in `playground3/COMPARISON.md`

**Checkpoint**: Comparison document covers all required areas with concrete code examples

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and cleanup

- [ ] T019 Run all 4 endpoints via quickstart.md curl commands and verify response shapes match playground2 exactly
- [ ] T020 Verify server starts cleanly with `mvn spring-boot:run` and all error cases return correct status codes (400, 401)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US1 Registration (Phase 3)**: Depends on Phase 2
- **US2 Login (Phase 4)**: Depends on Phase 3 (needs registration to test login)
- **US3 Token Refresh (Phase 5)**: Depends on Phase 4 (needs login to get refresh token)
- **US4 Protected Profile (Phase 6)**: Depends on Phase 4 (needs login to get access token)
- **US5 Comparison (Phase 7)**: Depends on Phase 6 (needs all code complete)
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

```
US1 (Registration) ──→ US2 (Login) ──→ US3 (Token Refresh)
                                  └──→ US4 (Protected Profile)
                                                      └──→ US5 (Comparison)
```

### Parallel Opportunities

- T003, T004, T005 can run in parallel (different files, no shared dependencies)
- US3 and US4 can start in parallel once US2 is complete (different files touched)
- Within US4: T014 (filter), T015 (service method) can start in parallel, then T016 and T017 follow

### Parallel Example: Foundational Phase

```text
# These three tasks create independent utility/model files:
T003: Create User.java model
T004: Create HashUtil.java
T005: Create JwtUtil.java
# Then:
T006: Create UserRepository.java (depends on User model from T003)
```

### Parallel Example: US3 + US4

```text
# Once US2 (login) is complete, these can proceed in parallel:
US3: T012 + T013 (refresh token endpoint)
US4: T014 + T015 + T016 + T017 (profile endpoint + JWT filter)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T006)
3. Complete Phase 3: US1 Registration (T007–T009)
4. **STOP and VALIDATE**: Test registration with curl
5. Server boots, users can register — core value delivered

### Incremental Delivery

1. Setup + Foundational → Project runs, but no endpoints yet
2. Add US1 → Registration works → Test with curl (MVP!)
3. Add US2 → Login works → Full auth lifecycle starts
4. Add US3 → Token refresh works → Session continuity
5. Add US4 → Protected profile works → Complete auth system
6. Add US5 → Comparison doc → Learning objective complete

---

## Notes

- All file paths use `playground3/src/main/java/com/example/playground3/` as base
- No test framework configured — manual testing via curl (consistent with playground2)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
