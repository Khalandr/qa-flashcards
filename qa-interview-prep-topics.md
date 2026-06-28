# QA Automation Engineer — Interview Prep Topic Map

> Productiv Teams · Technical interview prep · Topics only (no answers yet)
> Suggested expansion order: 2 → 1 → 3 → 4/5 → 6 → 7/8

---

## 1. REST API Testing

**What to validate (per request/response)**
- Status codes (which code is *correct* for which scenario)
- Response body / payload correctness
- Schema validation (structure, data types, required vs optional, nullability)
- Response headers (Content-Type, caching, CORS, auth-related)
- Error response structure and messages
- Field-level validation (formats, boundaries, enums)

**Cross-cutting concerns**
- Authentication & authorization (token-based, expired/invalid/missing, RBAC)
- Rate limiting / throttling (429 handling)
- Timing / response time / latency thresholds
- Pagination, filtering, sorting, query params
- Idempotency (PUT/DELETE, retries)
- Data consistency across endpoints (CRUD chains)
- Test data lifecycle (setup/teardown, isolation)

**Approaches & method semantics**
- Contract testing vs functional API testing
- HTTP method semantics (GET/POST/PUT/PATCH/DELETE)
- Positive vs negative testing
- Boundary & edge cases
- Versioning behavior
- API-seeding state for UI tests
- Mocking/stubbing vs real endpoints

**Playwright-specific** (light — deeper in §7)
- `request` fixture / `APIRequestContext`
- Combining API + UI in one flow
- Auth reuse (`storageState`)

---

## 2. UI Testing — Selectors (priority)

**Why CSS/XPath are fragile**
- Coupling to DOM structure / styling
- Breakage on refactor, maintenance cost
- Position-based selectors (`nth-child`) anti-pattern

**Selector hierarchy (best → worst)**
- Role-based (`getByRole`)
- Label / placeholder / text (`getByLabel`, `getByPlaceholder`, `getByText`, `getByAltText`, `getByTitle`)
- Test IDs (`getByTestId`) — when and why
- CSS / XPath — last resort, legitimate cases
- User-facing vs implementation-facing principle

**Locator mechanics**
- Lazy locators & auto-waiting / web-first assertions
- Strictness (one vs multiple matches)
- Chaining & filtering
- Dynamic content / lists / tables

---

## 3. Accessibility & Related (Playwright)

- ARIA roles model (underpins `getByRole`)
- Accessibility tree vs DOM tree
- `@axe-core/playwright` integration
- WCAG basics
- Accessibility-driven selectors as a quality signal
- Visual regression (`toHaveScreenshot`)
- Pushing devs toward semantic HTML / test IDs

---

## 4. SDLC & STLC (ISTQB)

- SDLC models (Waterfall, V-model, Agile/iterative)
- STLC phases
- QA's role across planning → development → release
- Shift-left testing
- Test levels (unit, integration, system, acceptance)
- Test types (functional, non-functional, structural, regression/confirmation)
- 7 testing principles
- Entry/exit criteria, definition of done

---

## 5. Foundational QA (ISTQB Foundation + Automation)

**Test design techniques**
- Black-box: equivalence partitioning, BVA, decision tables, state transition, use-case
- White-box: statement / branch / path coverage
- Experience-based: exploratory, error guessing, checklist

**Test documentation**
- Test plan, test case, test scenario, test suite
- Bug/defect report anatomy
- Traceability matrix
- Test summary report

**Coverage**
- Requirements vs code coverage
- Test pyramid
- Coverage % meaning ("coverage theater")

**Defect & process**
- Defect lifecycle / bug states
- Severity vs priority
- Verification vs validation
- Test estimation basics

---

## 6. Programming Fundamentals (JS/TS, language-agnostic concepts)

**OOP**
- What OOP is; class vs object
- Four pillars (encapsulation, abstraction, inheritance, polymorphism)
- SOLID principles
- Composition vs inheritance

**Core programming concepts**
- Data types (primitives vs reference/objects)
- Variables, scope, hoisting
- Functions / methods, parameters, return values
- Value vs reference (pass-by-value/reference)
- Equality & type coercion (`==` vs `===`)
- Mutability / immutability
- Arrays & objects, common methods (map/filter/reduce)

**Async**
- Sync vs async execution
- Callbacks → Promises → async/await
- Event loop (high level)
- Error handling (try/catch, promise rejection)
- Parallel vs sequential (`Promise.all` etc.)

**TS-flavored (light)**
- Types vs interfaces
- Type safety value in test automation
- Generics (awareness level)

---

## 7. Playwright Deep-Dive (the tool itself + how to use it)

**Architecture & core**
- How Playwright drives the browser (vs Cypress)
- Browser / context / page model
- Test isolation per context
- Config, projects, fixtures
- Auto-waiting & actionability checks

**Common scenarios / how-to**
- API checks with `request` / `APIRequestContext`
- Mixed API + UI flows
- Shadow DOM handling
- iframes, multiple tabs/windows, popups
- File upload / download
- Network interception & mocking (`route`, `fulfill`)
- Authentication / `storageState`
- Handling dialogs, hovers, drag-and-drop
- Waiting strategies (events, responses, `waitFor`)

**Execution & debugging**
- Parallelism, workers, sharding
- Retries, trace viewer, screenshots/video
- Reporters
- Tagging / grouping tests
- CI integration basics

---

## 8. Test Automation Design Patterns

- Page Object Model (POM)
- Component objects / nested POM
- Factory pattern (test data)
- Builder pattern (test data / requests)
- Fixtures pattern (Playwright-native)
- Singleton (e.g. config/driver) — and its caveats
- Data-driven testing
- Screenplay pattern (awareness)
- DRY / helpers / utilities vs over-abstraction
- Test independence & atomicity principles
