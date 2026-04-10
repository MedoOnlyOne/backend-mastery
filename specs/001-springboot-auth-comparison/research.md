# Research: Spring Boot JWT Auth Server

**Feature**: 001-springboot-auth-comparison
**Date**: 2026-04-10

## Decision 1: Build Tool — Maven

**Chosen**: Maven (pom.xml)
**Rationale**: `pom.xml` serves the same declarative dependency-list role as `package.json`, making the comparison direct. Maven is the default for Spring Initializr and dominant in Spring Boot tutorials.
**Alternatives considered**: Gradle — more flexible build scripting, but adds complexity without benefit for a learning project.

## Decision 2: JWT Library — JJWT v0.13.0

**Chosen**: JJWT (io.jsonwebtoken:jjwt-api 0.13.0)
**Rationale**: Fluent builder API (`Jwts.builder()`, `Jwts.parser()`) maps directly to the `jsonwebtoken` npm package's `jwt.sign()` / `jwt.verify()` calls, enabling clear side-by-side comparison. Most popular Java JWT library (11k+ stars).
**Alternatives considered**: Auth0 java-jwt (less community traction), Spring Security OAuth2 Resource Server (abstracts away JWT details — antithetical to learning objective).

## Decision 3: Password Hashing — spring-security-crypto (standalone)

**Chosen**: `spring-security-crypto` module only (not full Spring Security)
**Rationale**: `BCryptPasswordEncoder.encode()` and `.matches()` map directly to `bcrypt.hash()` and `bcrypt.compare()`. Works standalone without Spring Security's filter chains, AuthenticationManager, or UserDetailsService. Version managed by Spring Boot BOM.
**Alternatives considered**: jBCrypt (standalone library, but adding another dependency when spring-security-crypto does the same job); full Spring Security (overkill for this scope).

## Decision 4: Spring Boot Version — 3.5.6, Java 17+

**Chosen**: Spring Boot 3.5.6, Java 17 minimum
**Rationale**: Current stable release. Java 17 is the minimum for Spring Boot 3.x and sufficient for this learning exercise.
**Alternatives considered**: Spring Boot 2.x (no longer supported), Java 21 (adds virtual threads — not needed here).

## Decision 5: JWT Validation — Plain Servlet Filter

**Chosen**: `jakarta.servlet.Filter` implementation (no Spring Security)
**Rationale**: A servlet filter is the closest analog to Express middleware — both intercept requests, extract the Authorization header, verify the JWT, and reject (401) or pass through. Avoids the entire Spring Security abstraction layer, keeping focus on JWT mechanics.
**Alternatives considered**: HandlerInterceptor (Spring MVC specific, less directly comparable), Spring Security FilterChain (requires SecurityFilterChain, Authentication objects, @PreAuthorize — overkill and hides the learning objective).
