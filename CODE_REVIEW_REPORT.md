# Full Repository Code Review Report

**Date:** 2024-12-19  
**Repository:** svindo_vendor_app  
**Reviewer:** Principal Engineer Code Review

---

## 1. Executive Summary

### Highest-Impact Findings

- **CRITICAL**: Google Places API key hardcoded in 3 locations (`src/utils/apiKeys.ts:2`, `android/app/src/main/res/values/strings.xml:4`, `src/Modals/LocationSelectionModal.tsx:25`) — exposed secret allows unauthorized API usage and billing abuse
- **CRITICAL**: Android release keystore passwords hardcoded in `android/app/build.gradle:111-113` (`svindo123`) — compromise allows APK signing and distribution of malicious builds
- **CRITICAL**: No token refresh mechanism — 401 errors only log, don't refresh tokens, causing user session failures
- **MAJOR**: 540 instances of `any` type usage — defeats TypeScript's type safety, increases runtime error risk
- **MAJOR**: 376 `console.log/error/warn` statements in production code — leaks sensitive data, degrades performance
- **MAJOR**: Minimal test coverage — only 1 basic smoke test, no integration or unit tests for business logic
- **MAJOR**: No error boundaries — unhandled React errors crash entire app instead of graceful degradation

### Overall Risk Rating: **HIGH**

### Top 5 Must-Fix Items Before Next Release

1. **Remove all hardcoded secrets** — Move Google API key and keystore passwords to environment variables or secure config
2. **Implement token refresh logic** — Add automatic token refresh on 401 responses in `src/services/api/api.ts` and `src/services/api/base-query.ts`
3. **Add error boundaries** — Wrap app navigation and critical screens with React error boundaries
4. **Remove/guard console statements** — Strip or conditionally disable console logs in production builds
5. **Fix TypeScript `any` usage** — Replace `any` types with proper interfaces/types, starting with API responses and form data

---

## 2. Repository Inventory

### Tech Stack Summary

- **Language**: TypeScript (primary), JavaScript, Kotlin (Android), Swift (iOS)
- **Framework**: React Native 0.78.2
- **State Management**: Redux Toolkit (@reduxjs/toolkit 2.7.0), RTK Query
- **Navigation**: React Navigation 7.x (stack, bottom tabs, native stack)
- **UI Libraries**:
  - react-native-vector-icons
  - react-native-modal
  - react-native-image-picker
  - react-native-maps
  - react-native-gifted-chat (Stream Chat integration)
- **Backend Integration**: Axios, Firebase (Auth, Messaging)
- **Storage**: react-native-mmkv, @react-native-async-storage/async-storage
- **Form Management**: Formik 2.4.6, react-hook-form 7.56.1, Yup 1.7.0
- **Build Tools**: Metro bundler, Gradle (Android), CocoaPods (iOS)
- **Package Manager**: npm (package-lock.json present)
- **Testing**: Jest 29.6.3 (minimal usage)

### Repository Structure

- **Monorepo**: No — single React Native app
- **Entry Points**:
  - `index.js` → `App.tsx`
  - Android: `android/app/src/main/...`
  - iOS: `ios/Svindovender/AppDelegate.swift`
- **Key Directories**:
  - `src/Screens/` — 136 screen components (business logic heavy)
  - `src/services/` — API layer, Firebase, notifications
  - `src/CommonComponent/` — Reusable UI components
  - `src/utils/` — Utilities (validation, storage, location)
  - `src/Modals/` — Modal components
  - `src/navigation/` — Navigation configuration
  - `src/constants/` — API routes, app constants

### Ignored Directories (as per standard)

- `node_modules/`, `android/build/`, `android/app/build/`, `ios/Pods/`, `.gradle/`, `build/`, `.idea/`, `DerivedData/`

---

## 3. Dependency & Package Health

### Node.js Ecosystem Analysis

#### Outdated Packages (High Priority)

| Package        | Current | Latest Available     | Severity  | Notes                                                                        |
| -------------- | ------- | -------------------- | --------- | ---------------------------------------------------------------------------- |
| `moment`       | 2.30.1  | 2.30.1+ (deprecated) | **MAJOR** | Moment.js is in maintenance mode; migrate to `date-fns` or `dayjs`           |
| `formik`       | 2.4.6   | 2.4.6+               | **MINOR** | Latest 2.x is 2.4.6; consider migrating to React Hook Form (already in deps) |
| `prettier`     | 2.8.8   | 3.x                  | **MINOR** | Major version behind                                                         |
| `eslint`       | 8.19.0  | 9.x                  | **MINOR** | Major version behind (may require config migration)                          |
| `typescript`   | 5.0.4   | 5.6.x                | **MINOR** | Patch updates available                                                      |
| `react`        | 19.0.0  | 19.0.0               | **MAJOR** | React 19 with RN 0.78.2 may have compatibility issues — verify               |
| `react-native` | 0.78.2  | Latest 0.76.x        | **MAJOR** | Significantly behind latest stable (0.76.x)                                  |

#### Known Vulnerable/High-Risk Libraries

- **moment** (2.30.1): Deprecated, no security patches. Replace with `date-fns` or `dayjs`.
- **axios** (1.10.0): Check for CVE-2024-39338 and related vulnerabilities. Update to latest 1.x.
- **react-native** (0.78.2): Older version may have known CVEs. Check React Native security advisories.

#### Verification Commands

```bash
# Check outdated packages
npm outdated

# Audit for vulnerabilities
npm audit --production

# List dependency tree
npm ls --depth=0

# Check for known vulnerabilities (requires npm audit fix or manual review)
npm audit --audit-level=moderate
```

#### Concrete Upgrade Plan

**Batch 1 (Safe, Low Risk - Week 1)**

- Update TypeScript: `5.0.4` → `5.6.4`
- Update Prettier: `2.8.8` → `3.3.3`
- Update ESLint: `8.19.0` → `9.x` (requires config migration)
- Update axios: `1.10.0` → `1.7.7` (latest 1.x)
- **Files touched**: `package.json`, `.eslintrc.js` (if exists)
- **Tests**: Run full test suite, verify linting still works
- **Rollback**: Revert package.json, run `npm install`

**Batch 2 (Medium Risk - Week 2)**

- Replace `moment` with `dayjs`:
  - Install: `npm install dayjs`
  - Find/replace: `import moment from 'moment'` → `import dayjs from 'dayjs'`
  - Update all moment API calls to dayjs equivalents
- **Files touched**: All files using moment (grep for `moment`)
- **Tests**: Verify date formatting/parsing in affected screens
- **Rollback**: Revert commits, restore moment

**Batch 3 (High Risk - Week 3-4)**

- React Native upgrade: `0.78.2` → `0.76.x` (latest stable)
- React upgrade compatibility check
- **Files touched**: Potentially all native modules, gradle files, podfiles
- **Tests**: Full regression testing on Android/iOS devices
- **Rollback**: Git revert, rebuild native projects

---

## 4. Security Review

### Secrets & Leak Detection

#### CRITICAL: Hardcoded Google Places API Key

**Location 1**: `src/utils/apiKeys.ts:2`

```typescript
export const GOOGLE_PLACES_API_KEY = "AIzaSyA7KMENhwskSldSaVLZ-D0ifoluhkMmL7Y";
```

**Location 2**: `android/app/src/main/res/values/strings.xml:4`

```xml
<string name="google_maps_key">AIzaSyA7KMENhwskSldSaVLZ-D0ifoluhkMmL7Y</string>
```

**Location 3**: Used in `src/Modals/LocationSelectionModal.tsx:25`, `src/utils/locationUtils.ts:1`

**Impact**:

- API key exposed in source code and compiled APK/IPA
- Unauthorized usage can result in billing abuse
- Key can be extracted via reverse engineering

**Fix**:

1. Revoke current API key in Google Cloud Console
2. Generate new key with restricted usage (Android/iOS package restrictions)
3. Move to environment variables:
   - Create `.env` files (`.env.development`, `.env.production`)
   - Use `react-native-config` or `react-native-dotenv`
   - Add `.env*` to `.gitignore`
4. For Android: Use `BuildConfig` or `gradle.properties` (not committed)
5. For iOS: Use `Info.plist` with environment-specific configs

**Example Fix**:

```typescript
// src/utils/apiKeys.ts
import Config from "react-native-config";

export const GOOGLE_PLACES_API_KEY = Config.GOOGLE_PLACES_API_KEY || "";
```

#### CRITICAL: Hardcoded Keystore Passwords

**Location**: `android/app/build.gradle:111-113`

```gradle
release {
    storeFile file('release-key.keystore')
    storePassword 'svindo123'
    keyAlias 'svindo-key'
    keyPassword 'svindo123'
}
```

**Impact**:

- Anyone with repo access can sign malicious APKs
- If repo is public or leaked, attackers can distribute fake apps

**Fix**:

1. Move passwords to `android/keystore.properties` (add to `.gitignore`)
2. Load in `build.gradle`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

release {
    storeFile file(keystoreProperties['storeFile'] ?: 'release-key.keystore')
    storePassword keystoreProperties['storePassword'] ?: ''
    keyAlias keystoreProperties['keyAlias'] ?: ''
    keyPassword keystoreProperties['keyPassword'] ?: ''
}
```

3. Rotate keystore if repo was ever public

#### Hardcoded API Base URL

**Location**: `src/constants/app.constants.ts:2`

```typescript
API_BASE_URL: 'https://syndobackend.pythonanywhere.com/',
```

**Severity**: **MINOR** (not a secret, but should be configurable)

**Fix**: Move to environment variables for different environments (dev/staging/prod)

### Authentication & Authorization

#### Missing Token Refresh Logic

**Location**: `src/services/api/api.ts:43-45`

```typescript
if (error.response?.status === 401) {
  console.log("Unauthorized - redirecting to login...");
  // Optionally trigger logout or redirect here
}
```

**Issue**: No automatic token refresh on 401. Users get logged out unnecessarily.

**Fix**: Implement refresh token flow:

```typescript
// In api.ts interceptor
if (error.response?.status === 401) {
  const refreshToken = StorageUtils.getRefreshToken();
  if (refreshToken) {
    try {
      const response = await axios.post(
        `${APP_CONSTANTS.API_BASE_URL}${API_ROUTES.jwtRefresh}`,
        { refresh: refreshToken }
      );
      StorageUtils.setAccessToken(response.data.access);
      // Retry original request
      error.config.headers.Authorization = `Bearer ${response.data.access}`;
      return api.request(error.config);
    } catch (refreshError) {
      // Refresh failed, logout
      StorageUtils.clearAll();
      navigationRef.current?.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  }
}
```

**Also check**: `src/services/api/base-query.ts` — RTK Query needs similar refresh logic.

#### Token Storage Security

**Current**: Using `react-native-mmkv` (encrypted storage) — **GOOD**

**Recommendation**: Ensure tokens are never logged (see console.log issues below)

### Vulnerability Surface

#### SQL Injection / XSS / SSRF

- **SQL Injection**: N/A (mobile app, no direct DB access)
- **XSS**: Low risk (React Native, no DOM manipulation)
- **SSRF**: Check API endpoints that accept URLs — no obvious issues found

#### Input Validation

**Status**: Mixed implementation

- Some screens use Yup validation (`AddProductScreen.tsx`)
- Others use manual validation (`Expenses.tsx`, `CreateRequestScreen.tsx`)
- Inconsistent patterns across codebase

**Recommendation**: Standardize on Yup schemas for all forms

#### Unsafe Deserialization

**Location**: `src/utils/storage.ts:46-56`

```typescript
getUserData: () => {
  const data = storage.getString(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
},
```

**Issue**: `JSON.parse` without try-catch can crash app on malformed data.

**Fix**:

```typescript
getUserData: () => {
  try {
    const data = storage.getString(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
},
```

### Infrastructure & Container Security

- **Docker**: No Dockerfile found — N/A
- **Kubernetes**: No K8s manifests — N/A

### Security Hardening Commands

```bash
# Secret scanning (install tools first)
trufflehog filesystem --no-update --entropy False .

# Git leak detection
gitleaks detect -v

# Dependency vulnerability scanning (if using Snyk)
snyk test

# OWASP dependency check (if Maven/Gradle)
# For React Native, use npm audit instead
npm audit --production --audit-level=moderate
```

### Web Security Headers

**N/A** — React Native mobile app, not a web application. However, if using WebView components, ensure:

- Content-Security-Policy headers on loaded web content
- No `javascript:` protocol usage
- Validate all URLs before loading in WebView

---

## 5. Architecture & Modularity

### Layering & Boundaries

**Current State**:

- **Screens Layer**: 136 screen files, many >1000 lines (e.g., `AddProductScreen.tsx:2452`, `CreatePurchase.tsx:1412`)
- **Services Layer**: Thin API wrappers (`api.ts`, `base-query.ts`)
- **Utils Layer**: Mixed concerns (storage, validation, location, API keys)
- **Components**: Reusable UI components in `CommonComponent/`

**Issues**:

1. **Fat Screens**: Business logic embedded in screen components (validation, API calls, state management)
2. **No Service Layer**: API calls scattered across screens instead of centralized services
3. **Mixed Concerns**: `apiKeys.ts` in utils (should be config/env)

### Cyclic Dependencies

**Not Detected**: No obvious cycles found, but deep dependency trees possible given screen count.

**Recommendation**: Run dependency analysis:

```bash
# Install madge
npm install -g madge

# Check for cycles
madge --circular --extensions ts,tsx src/
```

### Reusability & Duplication

#### Duplicate Validation Logic

**Examples**:

- `Expenses.tsx:130-147` — manual validation
- `CreateRequestScreen.tsx:237-276` — similar manual validation
- `AddCustomer.tsx:127-150` — yet another validation pattern
- `SalePOS.tsx:305-338` — validation logic

**Recommendation**: Extract to shared validation utilities or Yup schemas:

```typescript
// src/utils/validationSchemas.ts
export const expenseSchema = Yup.object().shape({
  expense: Yup.number().required("Expense amount is required"),
  expenseDate: Yup.date().required("Expense date is required"),
  // ...
});
```

#### Duplicate API Error Handling

**Location**: Multiple screens have try-catch with similar error handling.

**Recommendation**: Centralize in API interceptors (partially done, but inconsistent)

### Proposed Refactor Slices

**Slice 1: Extract Business Logic from Screens (Week 1-2)**

- Create `src/services/business/` directory
- Move purchase logic from `CreatePurchase.tsx` to `PurchaseService.ts`
- Move product logic from `AddProductScreen.tsx` to `ProductService.ts`
- Screens become thin presenters

**Slice 2: Standardize Validation (Week 2)**

- Create `src/utils/validationSchemas.ts` with Yup schemas
- Replace all manual validation with schemas
- Files touched: ~20-30 screen files

**Slice 3: Centralize API Calls (Week 3)**

- Move API calls from screens to service layer
- Use RTK Query mutations/queries consistently
- Files touched: All 136 screens (gradual migration)

---

## 6. Code Quality & Consistency

### Style Drift

**Issues**:

- Mixed naming: `CustomeButton.tsx` vs `CustomHeader.tsx` (typo: "Custome" should be "Custom")
- Inconsistent file naming: Some PascalCase, some kebab-case
- Mixed quote styles (single vs double) — should standardize

### TypeScript Usage

**Critical Issue**: 540 instances of `any` type

**Examples**:

- `src/services/api/api.ts:14` — `config: any`
- `src/utils/storage.ts:30` — `data: any`
- Screen components: `navigation: any`, `route: any`

**Impact**: Defeats TypeScript's purpose, increases runtime errors

**Fix Priority**:

1. Define proper types for navigation (`@react-navigation/native` types)
2. Type API responses (create interfaces in `src/type/`)
3. Replace `any` in form data with interfaces

### File Layout

**Issues**:

- Very large files: `AddProductScreen.tsx` (2452 lines), `CreatePurchase.tsx` (1412 lines)
- Should be split into smaller components/hooks

**Recommendation**:

- Extract form logic to custom hooks
- Split large screens into sub-components
- Target: <500 lines per file

### Console Statements

**Count**: 376 instances across 105 files

**Examples**:

- `src/services/api/api.ts:35` — `console.log("API Error Response →", error)` — may log tokens
- `App.tsx:26` — `console.log("Push notifications initialized successfully")`
- `src/services/api/base-query.ts:35` — `console.log("Request:", token, args)` — **LOGS TOKENS**

**Critical**: `base-query.ts:35` logs access tokens — **SECURITY RISK**

**Fix**:

1. Remove or guard with `__DEV__`:

```typescript
if (__DEV__) {
  console.log("Request:", args); // Don't log token
}
```

2. Use a logging library that strips in production (e.g., `react-native-logs`)
3. Add ESLint rule: `no-console` for production builds

### Readability

**Issues**:

- Large functions (200+ lines in some screens)
- Deep nesting (4-5 levels in some components)
- Magic numbers/strings (should be constants)

**Recommendation**:

- Extract functions to utilities
- Use early returns to reduce nesting
- Define constants for magic values

### Verification Commands

```bash
# TypeScript type checking
npx tsc --noEmit

# ESLint
npm run lint

# Prettier (if configured)
npx prettier --check "src/**/*.{ts,tsx}"

# Find console statements
grep -r "console\." src/ --include="*.ts" --include="*.tsx" | wc -l

# Find 'any' types
grep -r ": any" src/ --include="*.ts" --include="*.tsx" | wc -l
```

---

## 7. Performance & Reliability

### Hot Paths

**Identified**:

1. **API Interceptors** (`src/services/api/api.ts`) — runs on every request

   - Current: Synchronous token fetch (OK)
   - Issue: Logging on every request (performance hit)

2. **Storage Operations** (`src/utils/storage.ts`)

   - Using MMKV (fast) — **GOOD**
   - But: JSON.parse without try-catch can crash

3. **Large Screen Renders** (`AddProductScreen.tsx`, `CreatePurchase.tsx`)
   - 2000+ line components re-render entire tree
   - No memoization of expensive computations

### N+1 Queries

**Not Applicable**: Mobile app, API calls are explicit. However, check for:

- Loading lists without pagination (could cause performance issues)
- Multiple sequential API calls that could be parallelized

**Example**: `CreateRequestScreen.tsx:55-58` uses `Promise.all` — **GOOD**

### Synchronous I/O

**Status**: Using async/await correctly for API calls and storage (MMKV is async-safe)

### Blocking Calls in Async Loops

**Not Detected**: No obvious blocking operations in loops

### Caching Opportunities

**Missing**:

1. **API Response Caching**: RTK Query has caching, but not consistently used
2. **Image Caching**: Using `react-native-image-picker` — ensure images are cached
3. **Location Caching**: Location data fetched repeatedly — cache for session

**Recommendation**:

- Enable RTK Query caching with appropriate TTLs
- Use `react-native-fast-image` for image caching
- Cache location data in memory for current session

### Resource Usage Red Flags

**Identified**:

1. **Unbounded Lists**: Check if product/customer lists paginate (not verified)
2. **Memory Growth**: Large screen components hold state — could leak on navigation
3. **Console Logging**: 376 console statements in production degrade performance

### Concrete Fixes

**Fix 1: Remove Production Console Logs**

```typescript
// src/utils/logger.ts
const isDev = __DEV__;

export const logger = {
  log: (...args: any[]) => isDev && console.log(...args),
  error: (...args: any[]) => isDev && console.error(...args),
  warn: (...args: any[]) => isDev && console.warn(...args),
};
```

**Fix 2: Memoize Expensive Computations**

```typescript
// In large screens
const expensiveValue = useMemo(() => {
  // computation
}, [dependencies]);
```

**Fix 3: Implement Pagination**

- Add pagination to all list endpoints
- Use `FlatList` with `onEndReached` for infinite scroll

---

## 8. Testing & CI/CD

### Coverage Posture

**Current**:

- 1 test file: `__tests__/App.test.tsx` (basic smoke test)
- **Estimated Coverage**: <1%

**Missing**:

- Unit tests for utilities (validation, storage, location)
- Integration tests for API layer
- Component tests for critical screens
- E2E tests for critical flows (login, purchase, sale)

### Test Pyramid Balance

**Current**: All tests at top (E2E/smoke) — **INVERTED PYRAMID**

**Target**:

- 70% Unit tests (utilities, services, hooks)
- 20% Integration tests (API, navigation)
- 10% E2E tests (critical user flows)

### Flaky Patterns

**Not Detected**: Insufficient tests to identify flakiness

### Missing Integration/E2E Tests

**Critical Flows Needing Tests**:

1. Authentication flow (OTP → Login → Token refresh)
2. Purchase creation flow
3. Sale/POS flow
4. Product creation flow

### Test Commands

```bash
# Run tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Specific test file
npm test -- App.test.tsx
```

### CI Checks Present/Missing

**Present**: None detected (no `.github/workflows/`, `.gitlab-ci.yml`, or similar)

**Missing**:

- Lint check
- Type check (`tsc --noEmit`)
- Unit tests
- Security scan (`npm audit`)
- Build verification (Android/iOS)
- No pre-commit hooks detected

### Recommended Minimal CI Matrix

**GitHub Actions Example**:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --coverage

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit --audit-level=moderate
```

**Pre-commit Hooks** (using Husky):

```bash
npm install --save-dev husky lint-staged
npx husky init
```

`.husky/pre-commit`:

```bash
npx lint-staged
```

`package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
}
```

---

## 9. API & Interface Contracts

### REST API Presence

**Status**: REST API used via Axios and RTK Query

**Issues**:

1. **No OpenAPI/Swagger**: API routes defined in constants, but no schema documentation
2. **Inconsistent Error Responses**: Some endpoints return `{error: string}`, others may differ
3. **No Versioning**: API base URL has no version (`/api/v1/`)

### Backwards Compatibility

**Not Verified**: No versioning strategy visible

**Recommendation**:

- Add API versioning to base URL
- Document breaking changes
- Implement deprecation warnings in API responses

### Input Validation

**Status**: Mixed

- Client-side: Some Yup, some manual
- Server-side: Not verified (backend responsibility, but client should validate too)

**Recommendation**:

- Validate all inputs client-side before API calls
- Use Yup schemas consistently
- Handle server validation errors gracefully

### Error Model Consistency

**Current**: Inconsistent

- `api.ts:37` expects `error.response.data.error`
- Other endpoints may use different formats

**Fix**: Standardize error handling:

```typescript
interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string[]>;
}
```

---

## 10. Public Frontend Review

**N/A** — React Native mobile application, not a web frontend.

**However**, if using WebView components:

- Ensure responsive design within WebView
- Validate all URLs before loading
- Implement proper error handling for failed loads

---

## 11. Documentation & DX

### README Completeness

**Current**: Boilerplate React Native README with no project-specific information

**Missing**:

- Project description and purpose
- Environment setup (env variables, API keys)
- Local development setup
- Build instructions for Android/iOS
- Troubleshooting guide
- Architecture overview
- API documentation links

**Recommendation**: Replace with project-specific README including:

- How to set up `.env` files
- How to configure Google API keys
- How to set up keystore for Android
- Common issues and solutions

### Local Setup Friction

**Issues**:

- No `.env.example` file
- No setup script
- Secrets hardcoded (forces manual changes)

**Fix**:

- Create `.env.example` with placeholder values
- Add setup instructions to README
- Provide setup script (optional)

### Comment-to-Code Alignment

**Issues**:

- Outdated comments: `App.tsx:47-194` has large commented-out code block (should be removed)
- Some comments don't match implementation

**Recommendation**:

- Remove dead code
- Update or remove outdated comments
- Add JSDoc comments for public APIs

### ADRs/Architecture Notes

**Missing**: No Architecture Decision Records (ADRs) or architecture documentation

**Recommendation**: Document key decisions:

- Why Redux Toolkit + RTK Query?
- Why MMKV over AsyncStorage?
- Navigation structure rationale

---

## 12. Inline Findings (Top 15)

| Path                                    | Line           | Severity     | Issue                                                         | Concrete Fix                                                                      |
| --------------------------------------- | -------------- | ------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/utils/apiKeys.ts`                  | 2              | **critical** | Hardcoded Google Places API key exposed                       | Move to environment variable using `react-native-config`, revoke current key      |
| `android/app/build.gradle`              | 111-113        | **critical** | Hardcoded keystore passwords in source                        | Move to `keystore.properties` (gitignored), rotate keystore                       |
| `src/services/api/base-query.ts`        | 35             | **critical** | Logs access token in console (security leak)                  | Remove token from log: `console.log("Request:", args)` or use `__DEV__` guard     |
| `src/services/api/api.ts`               | 43-45          | **major**    | No token refresh on 401, users logged out unnecessarily       | Implement refresh token flow with retry logic (see Section 4)                     |
| `src/utils/storage.ts`                  | 46-56          | **major**    | JSON.parse without try-catch can crash app                    | Wrap in try-catch, return null on error                                           |
| `App.tsx`                               | 47-194         | **minor**    | Large commented-out code block (dead code)                    | Delete commented code, use git history if needed                                  |
| `src/CommonComponent/CustomeButton.tsx` | -              | **minor**    | Typo in filename: "Custome" should be "Custom"                | Rename file to `CustomButton.tsx`, update imports                                 |
| `src/services/api/api.ts`               | 14, 25, 30, 34 | **major**    | Excessive `any` types defeat TypeScript safety                | Define proper types: `AxiosRequestConfig`, `AxiosResponse`, `AxiosError`          |
| `src/Screens/AddProductScreen.tsx`      | -              | **major**    | File is 2452 lines (should be <500)                           | Split into: `AddProductForm.tsx`, `AddProductHooks.ts`, `AddProductValidation.ts` |
| `src/Screens/CreatePurchase.tsx`        | -              | **major**    | File is 1412 lines (should be <500)                           | Extract business logic to `PurchaseService.ts`, split into sub-components         |
| `src/utils/storage.ts`                  | 30, 32, 34     | **major**    | Using `any` type for stored data                              | Define interfaces: `UserData`, `BusinessProfile`, `LocationData`                  |
| `src/services/api/api.ts`               | 35             | **major**    | Console.log in production (performance + potential data leak) | Use `__DEV__` guard or logging library                                            |
| `src/Screens/Expenses.tsx`              | 144            | **minor**    | Console.log in validation (should be removed)                 | Remove or use logger utility                                                      |
| `src/Screens/SalePOS.tsx`               | 336            | **minor**    | Console.log in validation                                     | Remove or use logger utility                                                      |
| `package.json`                          | 29             | **major**    | Using deprecated `moment` library                             | Migrate to `dayjs` or `date-fns` (see Section 3)                                  |

---

## 13. Auto-Fix Plan

### Week 1: Security & Critical Fixes (High Priority, Low Risk)

**Batch 1.1: Remove Hardcoded Secrets**

- **Files**: `src/utils/apiKeys.ts`, `android/app/build.gradle`, `android/app/src/main/res/values/strings.xml`
- **Actions**:
  1. Install `react-native-config`
  2. Create `.env.example` and `.env` files
  3. Move API key to env variable
  4. Update Android build.gradle to use env
  5. Move keystore passwords to `keystore.properties`
  6. Update `.gitignore` to exclude `.env*` and `keystore.properties`
- **Risk**: Low (configuration change only)
- **Tests**: Verify app builds and API calls work
- **Rollback**: Revert commits, restore hardcoded values temporarily

**Batch 1.2: Fix Token Logging**

- **Files**: `src/services/api/base-query.ts:35`
- **Actions**: Remove token from console.log
- **Risk**: Very Low
- **Tests**: Verify requests still work
- **Rollback**: Git revert

**Batch 1.3: Add Error Handling to Storage**

- **Files**: `src/utils/storage.ts:46-56` (and similar methods)
- **Actions**: Wrap JSON.parse in try-catch
- **Risk**: Low
- **Tests**: Unit tests for storage utils
- **Rollback**: Git revert

### Week 2: Code Quality & Type Safety (Medium Priority, Medium Risk)

**Batch 2.1: Remove Console Statements**

- **Files**: All files with console.log (376 instances)
- **Actions**:
  1. Create `src/utils/logger.ts` with `__DEV__` guards
  2. Find/replace `console.log` → `logger.log`
  3. Remove sensitive data from logs
- **Risk**: Low (logging only)
- **Tests**: Verify app runs, check logs in dev mode
- **Rollback**: Git revert

**Batch 2.2: Fix TypeScript `any` Types (Phase 1)**

- **Files**: `src/services/api/api.ts`, `src/utils/storage.ts`
- **Actions**:
  1. Define `AxiosRequestConfig`, `AxiosResponse` types
  2. Define storage data interfaces
  3. Replace `any` with proper types
- **Risk**: Medium (may reveal type errors)
- **Tests**: Run `tsc --noEmit`, fix type errors
- **Rollback**: Git revert, restore `any` temporarily

**Batch 2.3: Implement Token Refresh**

- **Files**: `src/services/api/api.ts`, `src/services/api/base-query.ts`
- **Actions**: Add refresh token logic (see Section 4)
- **Risk**: Medium (authentication critical)
- **Tests**: Test 401 handling, token refresh flow
- **Rollback**: Git revert, manual testing

### Week 3-4: Architecture & Testing (Lower Priority, Higher Risk)

**Batch 3.1: Extract Business Logic**

- **Files**: `src/Screens/AddProductScreen.tsx`, `src/Screens/CreatePurchase.tsx`
- **Actions**:
  1. Create `src/services/business/ProductService.ts`
  2. Create `src/services/business/PurchaseService.ts`
  3. Move logic from screens to services
  4. Screens become thin presenters
- **Risk**: High (large refactor)
- **Tests**: Full regression testing on affected screens
- **Rollback**: Git revert, feature branch

**Batch 3.2: Standardize Validation**

- **Files**: ~20-30 screen files with manual validation
- **Actions**:
  1. Create `src/utils/validationSchemas.ts` with Yup schemas
  2. Replace manual validation with schemas
- **Risk**: Medium (validation logic changes)
- **Tests**: Test all forms, verify validation messages
- **Rollback**: Git revert per screen

**Batch 3.3: Add CI/CD**

- **Files**: `.github/workflows/ci.yml` (new)
- **Actions**:
  1. Set up GitHub Actions
  2. Add lint, type-check, test jobs
  3. Add pre-commit hooks (Husky)
- **Risk**: Low (CI only)
- **Tests**: Verify CI runs on PR
- **Rollback**: Disable workflow, remove hooks

**Batch 3.4: Dependency Updates**

- **Files**: `package.json`
- **Actions**: Follow upgrade plan from Section 3
- **Risk**: Varies by package
- **Tests**: Full regression testing
- **Rollback**: Revert package.json, `npm install`

---

## JSON Export

```json
{
  "risk_rating": "high",
  "top_must_fix": [
    "Remove hardcoded Google Places API key from src/utils/apiKeys.ts and android/app/src/main/res/values/strings.xml",
    "Remove hardcoded keystore passwords from android/app/build.gradle",
    "Implement token refresh logic in src/services/api/api.ts on 401 responses",
    "Remove access token from console.log in src/services/api/base-query.ts:35",
    "Add error boundaries to prevent app crashes on unhandled React errors"
  ],
  "outdated_dependencies": [
    {
      "ecosystem": "node",
      "name": "moment",
      "current": "2.30.1",
      "latest": "2.30.1",
      "severity": "major",
      "note": "Deprecated, migrate to dayjs or date-fns"
    },
    {
      "ecosystem": "node",
      "name": "react-native",
      "current": "0.78.2",
      "latest": "0.76.x",
      "severity": "major",
      "note": "Significantly behind latest stable"
    },
    {
      "ecosystem": "node",
      "name": "typescript",
      "current": "5.0.4",
      "latest": "5.6.4",
      "severity": "minor"
    },
    {
      "ecosystem": "node",
      "name": "prettier",
      "current": "2.8.8",
      "latest": "3.3.3",
      "severity": "minor"
    },
    {
      "ecosystem": "node",
      "name": "eslint",
      "current": "8.19.0",
      "latest": "9.x",
      "severity": "minor"
    }
  ],
  "security_findings": [
    {
      "path": "src/utils/apiKeys.ts",
      "line": 2,
      "severity": "critical",
      "issue": "Hardcoded Google Places API key exposed in source code",
      "fix": "Move to environment variable using react-native-config, revoke current key in Google Cloud Console"
    },
    {
      "path": "android/app/build.gradle",
      "line": 111,
      "severity": "critical",
      "issue": "Hardcoded keystore passwords (svindo123) in build file",
      "fix": "Move to keystore.properties file (gitignored), rotate keystore if repo was ever public"
    },
    {
      "path": "src/services/api/base-query.ts",
      "line": 35,
      "severity": "critical",
      "issue": "Access token logged in console.log - security leak",
      "fix": "Remove token from log statement or use __DEV__ guard"
    },
    {
      "path": "src/services/api/api.ts",
      "line": 43,
      "severity": "major",
      "issue": "No token refresh mechanism on 401 - users logged out unnecessarily",
      "fix": "Implement refresh token flow with automatic retry of failed request"
    },
    {
      "path": "src/utils/storage.ts",
      "line": 46,
      "severity": "major",
      "issue": "JSON.parse without try-catch can crash app on malformed data",
      "fix": "Wrap JSON.parse in try-catch, return null on error"
    }
  ],
  "inline_findings": [
    {
      "path": "src/utils/apiKeys.ts",
      "line": 2,
      "severity": "critical",
      "issue": "Hardcoded Google Places API key",
      "fix": "Move to environment variable"
    },
    {
      "path": "android/app/build.gradle",
      "line": 111,
      "severity": "critical",
      "issue": "Hardcoded keystore password",
      "fix": "Move to keystore.properties"
    },
    {
      "path": "src/services/api/base-query.ts",
      "line": 35,
      "severity": "critical",
      "issue": "Logs access token",
      "fix": "Remove token from log"
    },
    {
      "path": "src/services/api/api.ts",
      "line": 43,
      "severity": "major",
      "issue": "No token refresh on 401",
      "fix": "Implement refresh token flow"
    },
    {
      "path": "src/utils/storage.ts",
      "line": 46,
      "severity": "major",
      "issue": "JSON.parse without error handling",
      "fix": "Add try-catch"
    },
    {
      "path": "App.tsx",
      "line": 47,
      "severity": "minor",
      "issue": "Large commented-out code block",
      "fix": "Delete dead code"
    },
    {
      "path": "src/CommonComponent/CustomeButton.tsx",
      "line": 1,
      "severity": "minor",
      "issue": "Typo in filename: Custome should be Custom",
      "fix": "Rename file"
    },
    {
      "path": "src/services/api/api.ts",
      "line": 14,
      "severity": "major",
      "issue": "Using any type",
      "fix": "Define proper AxiosRequestConfig type"
    },
    {
      "path": "src/Screens/AddProductScreen.tsx",
      "line": 1,
      "severity": "major",
      "issue": "File is 2452 lines, should be split",
      "fix": "Extract to service layer and sub-components"
    },
    {
      "path": "src/Screens/CreatePurchase.tsx",
      "line": 1,
      "severity": "major",
      "issue": "File is 1412 lines, should be split",
      "fix": "Extract business logic to PurchaseService"
    },
    {
      "path": "src/utils/storage.ts",
      "line": 30,
      "severity": "major",
      "issue": "Using any type for data",
      "fix": "Define UserData interface"
    },
    {
      "path": "src/services/api/api.ts",
      "line": 35,
      "severity": "major",
      "issue": "Console.log in production",
      "fix": "Use __DEV__ guard or logger utility"
    },
    {
      "path": "src/Screens/Expenses.tsx",
      "line": 144,
      "severity": "minor",
      "issue": "Console.log in validation",
      "fix": "Remove or use logger"
    },
    {
      "path": "src/Screens/SalePOS.tsx",
      "line": 336,
      "severity": "minor",
      "issue": "Console.log in validation",
      "fix": "Remove or use logger"
    },
    {
      "path": "package.json",
      "line": 29,
      "severity": "major",
      "issue": "Using deprecated moment library",
      "fix": "Migrate to dayjs or date-fns"
    }
  ],
  "commands": [
    {
      "purpose": "Check for outdated npm packages",
      "command": "npm outdated"
    },
    {
      "purpose": "Audit npm packages for vulnerabilities",
      "command": "npm audit --production --audit-level=moderate"
    },
    {
      "purpose": "Type check TypeScript code",
      "command": "npx tsc --noEmit"
    },
    {
      "purpose": "Run ESLint",
      "command": "npm run lint"
    },
    {
      "purpose": "Run tests with coverage",
      "command": "npm test -- --coverage"
    },
    {
      "purpose": "Scan for secrets using trufflehog",
      "command": "trufflehog filesystem --no-update --entropy False ."
    },
    {
      "purpose": "Check for circular dependencies",
      "command": "npx madge --circular --extensions ts,tsx src/"
    },
    {
      "purpose": "Count console statements",
      "command": "grep -r \"console\\.\" src/ --include=\"*.ts\" --include=\"*.tsx\" | wc -l"
    },
    {
      "purpose": "Count any types",
      "command": "grep -r \": any\" src/ --include=\"*.ts\" --include=\"*.tsx\" | wc -l"
    }
  ]
}
```

---

## Conclusion

This React Native vendor application has **significant security vulnerabilities** (hardcoded secrets, token logging) and **code quality issues** (excessive `any` types, console logs, large files) that must be addressed before production deployment. The **high risk rating** is primarily due to exposed API keys and keystore passwords, which could lead to unauthorized access and malicious app distribution.

**Immediate Actions Required**:

1. Revoke and rotate all exposed secrets
2. Implement token refresh mechanism
3. Remove production console logs
4. Add error boundaries
5. Set up CI/CD pipeline

**Recommended Timeline**: 2-4 weeks for critical fixes, 2-3 months for full refactoring.

---

_End of Report_
