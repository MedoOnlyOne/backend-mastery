# Implementation Plan: Spring Boot JWT Auth Server & Framework Comparison

**Branch**: `001-springboot-auth-comparison` | **Date**: 2026-04-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-springboot-auth-comparison/spec.md`

## Summary

Reimplement playground2's Express.js JWT auth server in Spring Boot (playground3/), covering the same 4 endpoints (register, login, refresh, profile) with identical request/response shapes. Produce a comparison document highlighting differences in project structure, dependency management, security handling, code verbosity, and developer experience.

## Technical Context

**Language/Version**: Java 17+
**Primary Dependencies**: Spring Boot 3.5.6 (spring-boot-starter-web), JJWT 0.13.0, spring-security-crypto
**Storage**: In-memory (ArrayList), same as playground2
**Testing**: No test framework configured (consistent with existing playgrounds)
**Target Platform**: Linux/macOS/Windows (JVM)
**Project Type**: Web service (REST API)
**Performance Goals**: N/A (learning exercise)
**Constraints**: Must match playground2's API contract exactly
**Scale/Scope**: Single user, learning exercise, 4 endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file contains only placeholder template — no project-specific principles defined. No gates to evaluate. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/001-springboot-auth-comparison/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technology decisions and rationale
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Run and test instructions
├── contracts/
│   └── api.md           # Phase 1: API endpoint contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
playground3/
├── pom.xml                                    # Maven build file (equivalent to package.json)
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── example/
│                   └── playground3/
│                       ├── Playground3Application.java       # Entry point (equivalent to server.js)
│                       ├── config/
│                       │   └── JwtAuthFilter.java            # Servlet filter for JWT validation
│                       ├── controller/
│                       │   └── UserController.java           # Request handling (equivalent to user.controller.js)
│                       ├── model/
│                       │   └── User.java                     # User data class (equivalent to user.model.js)
│                       ├── repository/
│                       │   └── UserRepository.java           # In-memory data access (equivalent to user.repository.js)
│                       ├── service/
│                       │   └── UserService.java              # Business logic (equivalent to user.service.js)
│                       └── util/
│                           ├── JwtUtil.java                  # JWT creation/verification (equivalent to jwt.js)
│                           └── HashUtil.java                  # Password hashing (equivalent to hash.js)
└── COMPARISON.md                              # Framework comparison document
```

**Structure Decision**: Single Spring Boot project under `playground3/` following Spring's standard `src/main/java` convention. Package structure mirrors playground2's layered modules (controller, service, repository, model, util) for direct comparison.

## Architecture Mapping (playground2 → playground3)

| playground2 (Express/Node) | playground3 (Spring Boot/Java) | Role |
|----------------------------|-------------------------------|------|
| `server.js` | `Playground3Application.java` | Entry point, mounts router |
| `user/routes.js` | `UserController.java` + `@RequestMapping` | Route definitions |
| `user/controller/user.controller.js` | `UserController.java` methods | Request/response handling |
| `user/service/user.service.js` | `UserService.java` | Business logic |
| `user/repository/user.repository.js` | `UserRepository.java` | Data access |
| `user/model/user.model.js` | `User.java` + in-memory list in repository | Data store |
| `user/util/jwt.js` | `JwtUtil.java` | JWT creation/verification |
| `user/util/hash.js` | `HashUtil.java` | Password hashing |
| (implicit middleware) | `JwtAuthFilter.java` | JWT validation on protected routes |

## Complexity Tracking

No violations to justify. Constitution is a placeholder template.
