# Tasks: Spring Security Integration

**Input**: Design documents from `/specs/002-spring-security/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No test framework configured. Verification is done via manual API testing (curl) as documented in quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Dependency Migration)

**Purpose**: Replace the standalone security-crypto dependency with the full Spring Security starter

- [x] T001 Replace `spring-security-crypto` with `spring-boot-starter-security` in `playground3/pom.xml`

---

## Phase 2: Foundational (Security Infrastructure)

**Purpose**: Create the three new Spring Security components that replace the custom filter approach. These components serve all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Create `JsonAuthenticationEntryPoint` implementing `AuthenticationEntryPoint` that returns JSON `{"message": "Invalid token"}` with 401 status in `playground3/src/main/java/com/example/playground3/config/JsonAuthenticationEntryPoint.java`
- [x] T003 [P] Create `JwtAuthenticationFilter` extending `OncePerRequestFilter` that extracts Bearer token, validates via `JwtUtil.verifyAccessToken()`, and sets `SecurityContext` with email as principal in `playground3/src/main/java/com/example/playground3/config/JwtAuthenticationFilter.java`
- [x] T004 Create `SecurityConfig` with `@EnableWebSecurity` and `SecurityFilterChain` bean: disable CSRF/form-login/http-basic/logout, set STATELESS sessions, permitAll on POST /users/register, /users/login, /users/refresh, authenticate all other requests, register `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`, wire `JsonAuthenticationEntryPoint` in `playground3/src/main/java/com/example/playground3/config/SecurityConfig.java`

**Checkpoint**: Security infrastructure ready — new components compile, old components still in place

---

## Phase 3: User Story 1 - Protected Profile Access via Security Framework (Priority: P1) 🎯 MVP

**Goal**: Replace custom filter enforcement with Spring Security framework enforcement for the `/users/me` endpoint

**Independent Test**: Register a user, login to get tokens, then `GET /users/me` with valid Bearer token returns profile; without token returns 401 JSON

### Implementation for User Story 1

- [x] T005 [US1] Update `getProfile` method in `playground3/src/main/java/com/example/playground3/controller/UserController.java` — replace `@RequestAttribute("userEmail") String userEmail` with `@AuthenticationPrincipal String email` and update the response to use `email` variable. Add `import org.springframework.security.core.annotation.AuthenticationPrincipal`
- [x] T006 [US1] Delete old custom filter files: `playground3/src/main/java/com/example/playground3/config/JwtAuthFilter.java` and `playground3/src/main/java/com/example/playground3/config/FilterConfig.java`

**Checkpoint**: `GET /users/me` with valid token returns `{"email":"..."}`, without token returns `{"message":"Invalid token"}` with 401

---

## Phase 4: User Story 2 - Public Endpoint Access (Priority: P2)

**Goal**: Verify registration, login, and refresh endpoints remain publicly accessible after Spring Security integration

**Independent Test**: Call POST /users/register, POST /users/login, POST /users/refresh without any Authorization header — all return success responses

### Verification for User Story 2

- [x] T007 [US2] Verify public endpoints work without authentication per `specs/002-spring-security/contracts/endpoints.md` — test POST /users/register (201), POST /users/login (200 with tokens), POST /users/refresh (200 with new access token) using curl commands from `specs/002-spring-security/quickstart.md`

**Checkpoint**: All three public endpoints respond correctly without authentication

---

## Phase 5: User Story 3 - Centralized Error Responses (Priority: P3)

**Goal**: Verify security-related failures return consistent JSON error responses matching the existing application error format

**Independent Test**: Send requests with missing token, invalid token, and expired token to `/users/me` — all return `{"message":"..."}` with appropriate HTTP status

### Verification for User Story 3

- [x] T008 [US3] Verify error response format per `specs/002-spring-security/contracts/endpoints.md` — test GET /users/me with: (1) no Authorization header, (2) `Authorization: Bearer invalid-token`, (3) expired token — all must return JSON `{"message":"..."}` with 401 status

**Checkpoint**: All security error responses use consistent JSON format matching existing `GlobalExceptionHandler` output

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation update

- [x] T009 Run full quickstart.md end-to-end validation — register, login, access profile, refresh token, verify 401 on unauthenticated request
- [x] T010 [P] Update `playground3/COMPARISON.md` to document the Spring Security integration alongside the existing Express.js comparison

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion
- **US2 (Phase 4)**: Depends on Phase 3 completion (needs controller update + old files removed)
- **US3 (Phase 5)**: Depends on Phase 3 completion (needs security chain active)
- **Polish (Phase 6)**: Depends on all user stories verified

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 foundational components. No dependencies on other stories.
- **US2 (P2)**: Depends on US1 (needs old filter deleted and SecurityConfig active). Verification only.
- **US3 (P3)**: Depends on US1 (needs SecurityConfig + entry point active). Verification only.

### Within Each Phase

- T002 and T003 can run in parallel (different files)
- T004 depends on T002 and T003 (references both components)
- T005 and T006 can run in parallel (different files) but T006 logically follows T005
- T007 and T008 can run in parallel (independent verifications)

### Parallel Opportunities

- Phase 2: T002 and T003 can run in parallel
- Phase 6: T009 and T010 can run in parallel

---

## Parallel Example: Phase 2

```text
# Launch together (different files, no dependencies):
T002: Create JsonAuthenticationEntryPoint in config/JsonAuthenticationEntryPoint.java
T003: Create JwtAuthenticationFilter in config/JwtAuthenticationFilter.java

# Then after both complete:
T004: Create SecurityConfig in config/SecurityConfig.java (references T002 + T003)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Update pom.xml dependency
2. Complete Phase 2: Create all three security components
3. Complete Phase 3: Update controller, delete old files
4. **STOP and VALIDATE**: Test protected endpoint with and without token

### Incremental Delivery

1. Setup + Foundational → Security infrastructure ready
2. Add US1 → Protected access works via Spring Security (MVP!)
3. Verify US2 → Public endpoints confirmed working
4. Verify US3 → Error responses confirmed consistent
5. Polish → Full validation + documentation update

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No automated test framework — all verification via manual curl testing
- This is a migration, not a greenfield feature — existing code (JwtUtil, UserService, UserRepository, HashUtil, User) is unchanged
- The old files (JwtAuthFilter.java, FilterConfig.java) should only be deleted after the new SecurityConfig is in place and compiling
- Commit after each phase to keep history clean
