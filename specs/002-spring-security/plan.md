# Implementation Plan: Spring Security Integration

**Branch**: `002-spring-security` | **Date**: 2026-04-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-spring-security/spec.md`

## Summary

Replace the custom servlet filter authentication in playground3 with Spring Security's `SecurityFilterChain`. The existing JWT dual-token flow (access + refresh), JJWT library, BCrypt hashing, in-memory user storage, and all API contracts are preserved. The change is a security infrastructure migration — the custom `JwtAuthFilter` and `FilterConfig` are replaced by a `SecurityFilterChain` configuration, a `OncePerRequestFilter`-based JWT filter, and a JSON `AuthenticationEntryPoint`.

## Technical Context

**Language/Version**: Java 17+
**Primary Dependencies**: Spring Boot 3.4.3, Spring Security 6.x (via spring-boot-starter-security), JJWT 0.12.6
**Storage**: In-memory (ArrayList) — no persistence
**Testing**: No test framework configured; manual API testing via curl
**Target Platform**: JVM (local development)
**Project Type**: Web service (REST API)
**Performance Goals**: N/A (educational project)
**Constraints**: Preserve all existing API contracts, request/response formats, and HTTP status codes
**Scale/Scope**: Single-user educational project; 4 endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is a template (not configured) — no gates to enforce.

**Post-Design Re-check**: N/A — no constitution principles defined.

## Project Structure

### Documentation (this feature)

```text
specs/002-spring-security/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — technical decisions and rationale
├── data-model.md        # Phase 1 — entity documentation (unchanged)
├── quickstart.md        # Phase 1 — how to run and test
├── contracts/
│   └── endpoints.md     # Phase 1 — API contract documentation
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 — implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
playground3/
├── pom.xml
└── src/main/java/com/example/playground3/
    ├── Playground3Application.java       # Entry point (no changes)
    ├── config/
    │   ├── SecurityConfig.java           # NEW — SecurityFilterChain configuration
    │   ├── JwtAuthenticationFilter.java  # NEW — OncePerRequestFilter for JWT
    │   └── JsonAuthenticationEntryPoint.java # NEW — JSON 401 error handler
    ├── model/
    │   └── User.java                     # No changes
    ├── repository/
    │   └── UserRepository.java           # No changes
    ├── util/
    │   ├── HashUtil.java                 # No changes
    │   └── JwtUtil.java                  # No changes
    ├── service/
    │   └── UserService.java              # No changes
    └── controller/
        ├── UserController.java           # MODIFY — @AuthenticationPrincipal replaces @RequestAttribute
        └── GlobalExceptionHandler.java   # No changes
```

**Deleted files**:
- `config/JwtAuthFilter.java` — replaced by `JwtAuthenticationFilter`
- `config/FilterConfig.java` — replaced by `SecurityConfig`

**Structure Decision**: The existing playground3 layered structure is preserved. New security components are added to the existing `config/` package alongside the files they replace. No new packages or directories needed.

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `pom.xml` | MODIFY | Replace `spring-security-crypto` with `spring-boot-starter-security` |
| `config/SecurityConfig.java` | CREATE | `@Configuration` with `SecurityFilterChain` bean, `@EnableWebSecurity` |
| `config/JwtAuthenticationFilter.java` | CREATE | `@Component` extending `OncePerRequestFilter`, validates JWT, sets `SecurityContext` |
| `config/JsonAuthenticationEntryPoint.java` | CREATE | `@Component` implementing `AuthenticationEntryPoint`, returns JSON 401 |
| `config/JwtAuthFilter.java` | DELETE | Replaced by `JwtAuthenticationFilter` |
| `config/FilterConfig.java` | DELETE | Replaced by `SecurityConfig` |
| `controller/UserController.java` | MODIFY | `@RequestAttribute("userEmail")` → `@AuthenticationPrincipal String email` |

## Complexity Tracking

No constitution violations to justify.

## Implementation Phases

### Phase 0: Research (Complete)
See [research.md](research.md) for all technical decisions and rationale.

### Phase 1: Design (Complete)
- [data-model.md](data-model.md) — entities documented (unchanged from existing)
- [contracts/endpoints.md](contracts/endpoints.md) — API contract documentation
- [quickstart.md](quickstart.md) — run and test instructions

### Phase 2: Implementation (via /speckit.tasks)
Task generation will break the file changes above into ordered implementation steps.
