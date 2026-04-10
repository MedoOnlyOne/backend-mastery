# Express.js vs Spring Boot: JWT Auth Server Comparison

A side-by-side comparison of the same JWT authentication server implemented in Express.js (playground2) and Spring Boot (playground3).

---

## 1. Project Structure & Bootstrapping

**Express.js** — minimal, flat structure:

```
playground2/
├── package.json          # Dependencies + metadata
├── server.js             # Entry point (4 lines)
└── user/
    ├── routes.js
    ├── controller/
    ├── service/
    ├── repository/
    ├── model/
    └── util/
```

**Spring Boot** — deep, conventional structure:

```
playground3/
├── pom.xml               # Dependencies + build config
└── src/main/java/com/example/playground3/
    ├── Playground3Application.java    # Entry point
    ├── controller/
    ├── service/
    ├── repository/
    ├── model/
    ├── util/
    └── config/
```

**Key difference**: Express starts with a single file and grows organically. Spring Boot mandates a rigid directory convention (`src/main/java/...`) and requires a package hierarchy even for a 4-endpoint app. The Express `server.js` is 4 lines; Spring Boot's entry point alone needs a class + annotation + static main method.

---

## 2. Dependency Management

**Express.js** (`package.json`):

```json
{
  "dependencies": {
    "express": "^5.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.0"
  }
}
```

Install: `npm install` — downloads everything in seconds.

**Spring Boot** (`pom.xml`):

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.3</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.6</version>
    </dependency>
    <!-- + 2 more jjwt artifacts for runtime -->
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-crypto</artifactId>
    </dependency>
</dependencies>
```

Install: `mvn install` — first run downloads the Maven ecosystem (~50+ transitive deps for a "simple" web app).

**Key difference**: npm gives you exactly what you ask for. Spring Boot's "starter" packages pull in opinionated transitive dependencies. For this project: Express has 3 direct deps, Spring Boot has 4 direct deps but ~30+ transitive deps. The tradeoff: Spring Boot starters save you from figuring out compatible versions, but you get a lot of library code you may never touch.

---

## 3. Routing

**Express.js** — separate router file:

```javascript
// user/routes.js
const router = express.Router();
router.post('/register', usersController.registerUser);
router.post('/login', usersController.login);
router.post('/refresh', usersController.generateAccessToken);
router.get('/me', usersController.getProfile);
```

Mounted in `server.js`: `app.use('/users', userRouter);`

**Spring Boot** — annotations on controller methods:

```java
// controller/UserController.java
@RestController
@RequestMapping("/users")
public class UserController {
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody Map<String, String> body) { ... }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) { ... }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> generateAccessToken(@RequestBody Map<String, String> body) { ... }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getProfile(@RequestAttribute("userEmail") String userEmail) { ... }
}
```

**Key difference**: Express separates routing from handler functions — routes are data, controllers are functions. Spring Boot couples them via annotations — the routing configuration lives directly on the handler methods. Express routing is more discoverable (all routes visible in one file); Spring Boot routing is more co-located (route and handler in the same place). Both approaches scale, but the mental model differs.

---

## 4. Middleware & Filters

**Express.js** — middleware passed as function arguments:

```javascript
// Protected endpoint — no middleware framework needed
async function getProfile(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    try {
        const user = await userService.getProfile(token);
        return res.status(200).json({ email: user.email });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}
```

Token extraction and validation happen inline in the controller.

**Spring Boot** — servlet filter registered via configuration class:

```java
// config/JwtAuthFilter.java — 30+ lines for token extraction
@Component
public class JwtAuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        String header = httpRequest.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            sendError(httpResponse, "Invalid token");
            return;
        }
        String token = header.substring(7);
        try {
            var claims = JwtUtil.verifyAccessToken(token);
            request.setAttribute("userEmail", claims.getSubject());
            chain.doFilter(request, response);
        } catch (Exception e) {
            sendError(httpResponse, "Invalid token");
        }
    }
}

// config/FilterConfig.java — separate class to register the filter
@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtAuthFilterRegistration(JwtAuthFilter f) {
        FilterRegistrationBean<JwtAuthFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(f);
        registration.addUrlPatterns("/users/me");
        registration.setOrder(1);
        return registration;
    }
}
```

**Key difference**: Express middleware is just a function — you pass it where you need it. Spring Boot requires a filter class implementing `jakarta.servlet.Filter`, plus a `@Configuration` class to register it, plus Spring's `FilterRegistrationBean` API to control URL patterns. For the same task, Express uses 3 lines of inline code; Spring Boot uses 2 classes and ~40 lines. The Spring approach is more formal and decoupled, but significantly more verbose for simple cases.

---

## 5. Data Layer & Storage

**Express.js** — module exports a shared array:

```javascript
// user/model/user.model.js
exports.users = [];

// user/repository/user.repository.js
function findUserByEmail(email) {
    return users.find(u => u.email === email);
}
function createUser(email, hashedPassword) {
    const user = { email, password: hashedPassword };
    users.push(user);
    return user;
}
```

**Spring Boot** — Spring-managed bean with `ArrayList`:

```java
@Repository
public class UserRepository {
    private final List<User> users = new ArrayList<>();

    public User findUserByEmail(String email) {
        return users.stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }
    public User createUser(String email, String hashedPassword) {
        User user = new User(email, hashedPassword);
        users.add(user);
        return user;
    }
}
```

**Key difference**: Express uses plain objects and module closures. Spring Boot requires a class with `@Repository` annotation, getters/setters on the `User` model, and Java stream operations. The conceptual model is identical (in-memory list with find/create), but Java requires ~3x more code due to type declarations, constructors, and accessors. Spring's `@Repository` enables dependency injection, which is powerful for testing but adds ceremony for a simple list.

---

## Summary Table

| Aspect | Express.js | Spring Boot | Verbose? |
|--------|-----------|-------------|----------|
| **Lines of code** (excluding node_modules/target) | ~80 | ~180 | Spring Boot ~2x |
| **Files to create** | 8 | 8 + config | Similar |
| **Entry point** | 4 lines | 10 lines + class wrapper | Spring Boot more verbose |
| **Dependencies** | 3 direct | 4 direct, ~30 transitive | Spring Boot heavier |
| **Routing style** | Separate file, data-driven | Annotations on methods | Different mental models |
| **Middleware** | Inline function | Filter class + config class | Spring Boot ~5x more code |
| **Type safety** | None (JavaScript) | Full (Java) | Tradeoff: safety vs speed |
| **Startup time** | <1s | ~3-5s | Express faster |
| **Conventions** | Opt-in | Mandatory structure | Spring Boot more opinionated |
