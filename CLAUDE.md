# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Learning playground for backend mastery concepts (Node.js + Express). Each topic is isolated in its own directory with its own `package.json` and `node_modules` — no monorepo tooling.

**Course source:** https://backend-course.abdullahhatem.com/

## Project Directories

- **`simple-node-server/`** — Worker thread pool (Piscina) + task queue (P-queue) for offloading CPU-heavy work off the event loop. Uses **ESM** (`"type": "module"`). Express 5.
- **`playground/`** — Single-file JWT auth server with bcrypt password hashing and access/refresh token flow. Uses **CommonJS**. Express 5.
- **`playground2/`** — Same auth server refactored into a modular monolithic architecture. Uses **CommonJS**. Express 5.

## Running Projects

Each project runs independently. No shared build/test/lint tooling exists at the root level.

```bash
# From any project directory:
node index.js          # or node server.js for playground2
```

No test framework is configured. No linter is configured.

## Architecture: playground2 Layered Pattern

`playground2` is the most structured project and follows a layered modular architecture:

```
server.js                    # Entry point, mounts /users router
user/
  routes.js                  # Express router, maps endpoints to controllers
  controller/                # Request/response handling, delegates to service
  service/                   # Business logic, orchestrates repo + utils
  repository/                # Data access (in-memory array in model)
  model/                     # Data store (exports { users })
  util/                      # Shared utilities (jwt, hash)
```

Flow: **route → controller → service → repository**, with utilities (jwt, hashing) injected at the service layer.

## Module Systems

- `simple-node-server/`: ESM (`import`/`export default`) — `"type": "module"` in package.json
- `playground/`, `playground2/`: CommonJS (`require()`/`module.exports`)

## Active Technologies
- Java 17+ + Spring Boot 3.5.6 (spring-boot-starter-web), JJWT 0.13.0, spring-security-crypto (001-springboot-auth-comparison)
- In-memory (ArrayList), same as playground2 (001-springboot-auth-comparison)

## Recent Changes
- 001-springboot-auth-comparison: Added Java 17+ + Spring Boot 3.5.6 (spring-boot-starter-web), JJWT 0.13.0, spring-security-crypto
