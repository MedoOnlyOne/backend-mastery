# Research: Spring Security Integration

**Feature**: 002-spring-security | **Date**: 2026-04-11

## Decision 1: Use SecurityFilterChain with Lambda DSL

**Decision**: Configure Spring Security using `SecurityFilterChain` bean with the lambda DSL (Spring Security 6.x style).

**Rationale**: The deprecated `WebSecurityConfigurerAdapter` was removed in Spring Security 6.x. The lambda DSL is the current standard, provides better IDE support, and makes configuration intent explicit.

**Alternatives considered**:
- `WebSecurityConfigurerAdapter` — removed in Spring Security 6.x, not available
- Pure filter-based approach — already what we're replacing; no framework benefit

## Decision 2: OncePerRequestFilter for JWT Validation

**Decision**: Use `OncePerRequestFilter` as the base class for the JWT authentication filter, NOT `AbstractAuthenticationProcessingFilter`.

**Rationale**: `AbstractAuthenticationProcessingFilter` is designed for interactive authentication flows (form login) with `AuthenticationManager`, success/failure handlers, and session strategy. `OncePerRequestFilter` is the standard choice for Bearer token scenarios where you extract credentials, validate them, and set the `SecurityContext` directly. The Spring Security docs confirm: "If you are not integrating with Spring Security's Filters instances, you can set the SecurityContextHolder directly."

**Alternatives considered**:
- `AbstractAuthenticationProcessingFilter` — over-engineered for stateless JWT; requires `AuthenticationManager` and handler plumbing
- Raw `jakarta.servlet.Filter` — already in place; lacks Spring integration benefits

## Decision 3: Filter Placement — Before UsernamePasswordAuthenticationFilter

**Decision**: Insert the JWT filter before `UsernamePasswordAuthenticationFilter` in the Spring Security filter chain.

**Rationale**: The JWT filter needs to run early enough to set `SecurityContext` before `AuthorizationFilter` checks authorization. This position ensures it runs after security headers/CORS/CSRF filters but before any irrelevant auth-processing filters. The `SecurityContext` it sets is available to all subsequent filters including `ExceptionTranslationFilter` and `AuthorizationFilter`.

**Alternatives considered**:
- After `SecurityContextHolderFilter` — too early, before security headers
- After `ExceptionTranslationFilter` — too late; auth exceptions won't be caught

## Decision 4: @AuthenticationPrincipal for Controller Access

**Decision**: Use `@AuthenticationPrincipal String email` in controllers to access the authenticated user's email, replacing the current `@RequestAttribute("userEmail")` approach.

**Rationale**: `@AuthenticationPrincipal` is the idiomatic Spring MVC way to resolve the authenticated principal from `SecurityContext`. Since we store the email as a String principal in the filter, it injects directly. Clean, framework-aligned, and removes the controller's dependency on request attributes.

**Alternatives considered**:
- `SecurityContextHolder.getContext().getAuthentication()` — couples controller to Security API
- Custom principal type — over-engineered for a single email field; unnecessary until roles are needed
- Keep `@RequestAttribute` — defeats the purpose of using Spring Security's context

## Decision 5: Custom AuthenticationEntryPoint for JSON Errors

**Decision**: Implement a custom `AuthenticationEntryPoint` that writes JSON `{"message": "Invalid token"}` with 401 status, instead of using `@RestControllerAdvice`.

**Rationale**: Spring Security exceptions (`AuthenticationException`) are thrown inside the security filter chain, which runs BEFORE `DispatcherServlet`. `@RestControllerAdvice` / `@ExceptionHandler` only handle exceptions thrown within Spring MVC controller methods. A custom `AuthenticationEntryPoint` is the correct integration point for authentication failures in the filter chain. The existing `GlobalExceptionHandler` continues handling service-layer exceptions (`IllegalArgumentException`, `IllegalStateException`).

**Alternatives considered**:
- `@ExceptionHandler(AuthenticationException.class)` in `GlobalExceptionHandler` — cannot catch security filter exceptions (wrong layer)
- `response.sendError()` — triggers Spring Boot's `BasicErrorController`, produces inconsistent JSON format

## Decision 6: Deferred Authentication in Filter

**Decision**: When no Bearer token is present, the JWT filter does NOT reject the request — it passes through to the next filter. Spring Security's `AuthorizationFilter` and `ExceptionTranslationFilter` handle rejection for protected endpoints.

**Rationale**: This follows the "deferred authentication lookup" pattern from Spring Security docs. The filter's sole responsibility is extracting and validating credentials when present. The `SecurityFilterChain`'s authorization rules determine whether authentication is required. This cleanly separates authentication (filter) from authorization (chain config).

**Alternatives considered**:
- Reject immediately in filter — couples filter to endpoint authorization rules; breaks permitAll endpoints

## Decision 7: Dependency Change — spring-boot-starter-security

**Decision**: Replace `spring-security-crypto` with `spring-boot-starter-security` in pom.xml.

**Rationale**: `spring-boot-starter-security` is the full Spring Security starter that includes auto-configuration, `spring-security-crypto` (transitively), `spring-security-web`, and `spring-security-config`. The existing `spring-security-crypto` was only used for `BCryptPasswordEncoder` — it's included transitively by the starter so the explicit dependency becomes redundant.

**Alternatives considered**:
- Keep `spring-security-crypto` alongside starter — redundant; starter includes it
- Add individual Spring Security modules — more work, no benefit over starter
