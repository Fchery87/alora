# AGENTS.md

## 📋 Overview

**Project Name:** Alora
**Purpose:** Parenting support mobile application combining baby tracking with parental mental health support
**Current Status:** Production Ready ✅

### Mission & Vision

**Mission:** Reduce mental load for new parents by centralizing baby care tracking while supporting parental mental health and enabling shared parenting.

**Vision:** To become the most trusted companion for new parents, supporting both baby's needs and caregivers' emotional wellbeing.

### Core Values

1. **Practical Clarity** – Centralize tracking, reduce mental load
2. **Emotional Support** – Compassionate tools for parental wellbeing
3. **Shared Parenting** – Help partners stay synchronized
4. **Inclusive & Non-Judgmental** – Serve all family types equally

---

## 🏗️ Architecture & Tech Stack

### Frontend

- **Framework:** React Native 18.3.1 + Expo 52.0.49
- **Navigation:** Expo Router 4.0.20
- **State Management:** Zustand 5.0.11 + TanStack Query 5.90.20
- **UI Components:** Tamagui + Reanimated
- **Styling:** Tailwind CSS 3.4.17 + NativeWind
- **Typography:** Google Fonts (Outfit, DM Sans, Crimson Pro)
- **Animations:** Moti, React Native Reanimated

### Backend

- **Database:** Convex 1.31.7 (serverless)
- **Authentication:** Clerk 2.19.21 (organizations support)
- **Encryption:** AES-256-CBC + HMAC-SHA256

### Development Tools

- **Package Manager:** Bun 1.1.29
- **Language:** TypeScript 5.7.3 (strict mode)
- **Testing:** Vitest + Detox E2E
- **Linting:** ESLint 8.57.0 + TypeScript ESLint
- **Formatting:** Prettier 3.8.1
- **Git Hooks:** Husky + lint-staged

### Project Structure

```
alora/
├── app/              # Expo Router screens (tabs, auth)
├── components/       # Atomic Design components
│   ├── atoms/       # Button, Input, Toast
│   ├── molecules/   # FeedCard, DiaperCard
│   ├── organisms/   # FeedTracker, ActivityFeed
│   └── providers/   # SecurityProvider
├── hooks/           # Custom React hooks
├── lib/             # Utilities (convex, clerk, encryption)
├── stores/          # Zustand state stores
├── convex/          # Backend functions & schema
├── docs/            # Documentation
└── __tests__/       # Unit tests
```

---

## 🔄 Development Workflow

### Branch Strategy

```
main (production)
  └── develop (staging)
       ├── feature/*   (short, descriptive names)
       └── bugfix/*
```

### Git Workflow

1. **Start:** Create feature branch from `develop`

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Develop:** Make changes following atomic commit practices

3. **Test Locally:**

   ```bash
   bun run test           # Run unit tests
   bun run test:watch     # Watch mode
   bun run typecheck      # TypeScript validation
   bun run lint           # ESLint check
   bun run format:check   # Prettier check
   ```

4. **Commit:** Commit with clear messages

   ```bash
   git add .
   git commit -m "type(scope): message"
   ```

5. **Review:** Create pull request to `develop`
   - Ensure all tests pass
   - Ensure typecheck passes
   - Ensure lint passes

6. **Merge:** After code review, merge to `develop`

7. **Deploy:** When ready, merge `develop` → `main`
   - Follow deployment checklist in README

### Atomic Development Principles

**What to Include in One PR:**

- One feature
- One bugfix
- One refactor (minimal scope)

**What NOT to Include:**

- Multiple unrelated features
- Breaking changes to shared APIs
- Performance improvements unrelated to feature

---

## 🧪 Testing Guidelines

### Unit Testing (Vitest)

**When to Write Tests:**

- New components (especially complex logic)
- New Convex functions
- Custom hooks
- Form validation logic
- Security/cryptographic utilities

**Test Structure:**

```typescript
// describe describe what it tests
describe('ComponentName', () => {
  // it describe specific behavior
  it('should render correctly with props', () => {
    // arrange
    const props = { title: 'Test' };
    // act
    const result = render(<Component {...props} />);
    // assert
    expect(result.getByText('Test')).toBeTruthy();
  });
});
```

**Running Tests:**

```bash
bun run test              # Run all tests
bun run test:watch        # Watch mode
bun run test:coverage     # Coverage report
```

### E2E Testing (Detox)

**When to Write E2E Tests:**

- Critical user flows (auth, core tracking)
- Complex state transitions
- Cross-platform behavior

**Test Structure:**

```typescript
describe("Authentication Flow", () => {
  it("should allow user registration and login", async () => {
    await device.reloadReactNative();
    await element(by.id("register-button")).tap();
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("register-button")).tap();
    await waitFor(element(by.id("dashboard"))).toBeVisible();
  });
});
```

**Running E2E Tests:**

```bash
bun run test:e2e:build    # Build for E2E
bun run test:e2e          # Run E2E tests
```

### Test Coverage Targets

- **Critical Features:** 100% coverage
- **Business Logic:** 80%+ coverage
- **Utilities:** 90%+ coverage
- **UI Components:** 60%+ coverage

---

## 🎨 Code Quality Standards

### TypeScript

- **Strict Mode:** Always enabled
- **No `any` Types:** Use specific types
- **Null Checks:** Enforced
- **Path Aliases:** Use `@/` prefix
  - `@/components/*`
  - `@/hooks/*`
  - `@/lib/*`
  - `@/stores/*`

### ESLint Rules

```javascript
// Critical rules (always follow)
react-hooks/rules-of-hooks: error
react-hooks/exhaustive-deps: warn

// Recommended rules
react-native/no-inline-styles: warn
@typescript-eslint/no-unused-vars: warn

// Relax for React Native
@typescript-eslint/no-explicit-any: off
@typescript-eslint/ban-types: off
```

### Prettier Formatting

- 2-space indentation
- Single quotes for strings
- Trailing commas in objects/arrays
- No semicolons (except for TypeScript not used)
- Sensitive to file encoding (UTF-8)

### Naming Conventions

**Components:**

- React Native Components: PascalCase (`FeedCard.tsx`)
- UI Components: PascalCase (`Button.tsx`)
- Icons: camelCase (`HomeIcon.tsx`)

**Functions:**

- Hooks: `use` prefix (`useFeeds.ts`)
- Components: PascalCase (`renderList.ts`)
- Utils: camelCase (`formatDate.ts`)

**Constants:**

- PascalCase (`MAX_ITEMS_PER_PAGE`)

**Files:**

- TypeScript: `.ts` or `.tsx`
- Test files: `.test.ts` or `.test.tsx`
- Mock files: `.mock.ts`

### Code Style Guidelines

**Components:**

```typescript
// Props interface first
interface FeedCardProps {
  feed: Feed;
  onPress?: () => void;
  onDelete?: () => void;
}

// Functional component with hooks
export function FeedCard({ feed, onPress, onDelete }: FeedCardProps) {
  const { isDeleting } = useFeedState(feed.id);

  return (
    <View>
      {/* Component implementation */}
    </View>
  );
}
```

**Hooks:**

```typescript
// Named export with TypeScript generics
export function useFeeds(babyId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feeds", babyId],
    queryFn: () => api.getFeeds(babyId),
  });

  const createFeed = async (feed: NewFeed) => {
    await api.createFeed(babyId, feed);
  };

  return { feeds: data, isLoading, error, createFeed };
}
```

**Utility Functions:**

```typescript
// Pure functions preferred
// Input validation
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    error: emailRegex.test(email) ? undefined : "Invalid email format",
  };
}
```

---

## 🔒 Security & Data Protection

### Authentication

- **Provider:** Clerk (organizations support)
- **Biometrics:** expo-local-authentication
- **Session Management:** Auto-lock after 5 minutes inactivity
- **Secure Storage:** expo-secure-store

### Encryption

- **Algorithm:** AES-256-CBC + HMAC-SHA256
- **Pattern:** Encrypt-then-MAC
- **Key Management:** Secure storage with proper key rotation
- **IV Generation:** Random 16-byte per encryption

### Data Protection Rules

1. **Never** hardcode credentials or keys
2. **Always** validate and sanitize inputs
3. **Always** check authentication before data access
4. **Always** use environment variables for secrets
5. **Always** implement proper error handling (no sensitive data leaks)

---

## 📝 Documentation Standards

### Documentation Hierarchy

**Required Documentation:**

- ✅ README.md (getting started, features)
- ✅ Architecture.md (technical decisions)
- ✅ PRD.md (product requirements)
- ✅ API_DOCUMENTATION.md (backend endpoints)

**Documentation Templates:**

**New Feature:**

```markdown
## Feature Name

### Overview

Brief description of the feature

### Implementation

- Technical approach
- Components involved
- Data flow

### Testing

- Unit tests
- E2E tests
- Manual test cases

### Migration Notes

- Breaking changes
- Deprecations
- Rollback plan
```

**Code Comments:**

```typescript
/**
 * Validates email format for user registration
 * @param email - Email address to validate
 * @returns Validation result with success status and error message
 */
export function validateEmail(email: string): ValidationResult {
  // Implementation
}
```

### Documentation Updates

- Update README when features change
- Update Architecture.md when architectural decisions change
- Update API_DOCUMENTATION.md when backend endpoints change
- Update docs/ directory for implementation details

---

## 🚀 Commit Message Standards

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type Categories

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic changes)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Build process, dependencies

### Examples

```bash
# Simple
feat(feeds): add new feed tracking feature

# Complex
feat(trackers): implement diaper tracking with color indicators

# Breaking change
feat(auth): replace username with email-only auth

# Documentation
docs(readme): update installation instructions

# Security
security: implement biometric authentication
```

---

## 📦 Package Management

### Dependencies Management

**Package Manager:** Bun (not npm or yarn)

**Installing Dependencies:**

```bash
bun install              # Install all
bun add package-name     # Add to dependencies
bun add -D package-name  # Add to devDependencies
```

**Updating Dependencies:**

```bash
bun update               # Update all
bun update package-name  # Update specific
```

**Lock Files:**

- Use `bun.lockb` (not package-lock.json)
- Commit lock files to git

### Dependency Versions

- **Major Versions:** Careful updates, test thoroughly
- **Minor Versions:** Generally safe, test if breaking changes
- **Patch Versions:** Usually safe, test if bugs fixed
- **Overridden Packages:** See `package.json` `overrides` field

---

## 🔧 Development Commands

### Development

```bash
bun run start            # Start Metro bundler
bun run ios              # Run on iOS simulator
bun run android          # Run on Android emulator
bun run web              # Run on web browser
```

### Testing

```bash
bun run test             # Run all unit tests
bun run test:watch       # Watch mode
bun run test:e2e         # Run E2E tests
bun run test:e2e:build   # Build for E2E
```

### Code Quality

```bash
bun run lint             # Run ESLint
bun run lint:fix         # Auto-fix ESLint
bun run typecheck        # TypeScript validation
bun run format           # Format with Prettier
bun run format:check     # Check formatting
```

### Backend

```bash
bun run convex dev       # Start Convex dev server
bun run convex deploy    # Deploy Convex functions
bun run convex db push   # Push schema changes
```

### Building

```bash
bun run ios              # Build iOS
bun run android          # Build Android
bun run web              # Build web
```

---

## 🎯 Agent-Specific Workflows

### Adding New Features

1. **Research & Design**
   - Review PRD and Architecture
   - Plan component structure
   - Design data flow
   - Identify dependencies

2. **Implementation**
   - Create feature branch
   - Write tests first (TDD)
   - Implement features
   - Update documentation

3. **Review & Refine**
   - Run all tests
   - Typecheck
   - Lint
   - Peer review

4. **Deploy**
   - Merge to develop
   - Create preview build
   - Test preview
   - Merge to main when ready

### Fixing Bugs

1. **Reproduce**
   - Understand bug from issue description
   - Create minimal reproduction case
   - Run failing tests

2. **Debug**
   - Use logs and debugging tools
   - Check error messages
   - Verify assumptions

3. **Fix**
   - Apply minimal fix
   - Write regression tests
   - Update related code

4. **Verify**
   - Run all tests
   - Manual testing
   - Typecheck and lint

### Code Refactoring

1. **Identify**
   - Find code that needs improvement
   - Check if tests exist
   - Plan scope

2. **Prepare**
   - Create backup branch
   - Ensure all tests pass

3. **Refactor**
   - Apply small changes
   - Maintain functionality
   - Add tests if needed

4. **Verify**
   - Run all tests
   - Typecheck
   - Manual testing

---

## 🚧 Pre-Commit Checks

Before committing, ensure:

1. **Code Quality**

   ```bash
   bun run typecheck && bun run lint && bun run format:check
   ```

2. **Tests**

   ```bash
   bun run test
   ```

3. **Git**

   ```bash
   git status
   git add .
   git commit -m "type(scope): message"
   ```

4. **Husky Hook** (automatically runs)
   ```bash
   bunx lint-staged
   ```

---

## 📊 Performance Considerations

### Performance Targets

| Metric         | Target     | Monitoring            |
| -------------- | ---------- | --------------------- |
| App Launch     | <3 seconds | Performance testing   |
| Memory Usage   | <150MB     | React Native Profiler |
| Animation FPS  | 60fps      | Reanimated profiler   |
| Query Response | <200ms     | Convex monitoring     |

### Optimization Guidelines

1. **Use Memoization**

   ```typescript
   // Use React.memo for expensive components
   export const FeedCard = React.memo(({ feed }) => {
     // Component logic
   });
   ```

2. **Lazy Load**

   ```typescript
   // Lazy load heavy components
   const HeavyComponent = React.lazy(() => import("./HeavyComponent"));
   ```

3. **Optimistic Updates**

   ```typescript
   // Use TanStack Query for optimistic updates
   const updateMutation = useMutation({
     mutationFn: api.updateFeed,
     onMutate: async (newFeed) => {
       // Optimistic update
     },
     onError: (err, variables, context) => {
       // Rollback
     },
   });
   ```

4. **Pagination**
   - Use pagination for large lists
   - Implement virtualization if needed

---

## 🔐 CI/CD Pipeline

### GitHub Actions Workflows

**CI Pipeline** (runs on PR and push to main/develop):

1. Install dependencies
2. Run lint
3. Run typecheck
4. Run tests

**Build Preview** (on develop branch):

1. Build iOS preview
2. Build Android preview

**Build Production** (on main branch):

1. Build iOS production
2. Build Android production

### Pre-Deployment Checklist

- ✅ All tests pass
- ✅ Typecheck passes
- ✅ Lint passes
- ✅ Documentation updated
- ✅ No breaking changes
- ✅ Review completed
- ✅ Preview tested

---

## 📚 Learning Resources

### Internal Documentation

- README.md - Project overview and setup
- docs/Architecture.md - Technical architecture
- docs/PRD.md - Product requirements
- docs/API_DOCUMENTATION.md - API endpoints

### External Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs/)
- [Tamagui Documentation](https://tamagui.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## 🤝 Collaboration Guidelines

### Pull Request Requirements

**Mandatory Checklist:**

- [ ] Feature branch from develop
- [ ] All tests pass
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] Review by team member
- [ ] Preview tested if applicable

**PR Template:**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Screenshots

(If applicable)

## Test Plan

- Unit tests added/updated
- E2E tests added/updated
- Manual testing performed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
```

### Code Review Standards

**Focus Areas:**

- Code quality and readability
- Performance impact
- Security implications
- Testing coverage
- Documentation completeness

**Review Tips:**

- Start with positive comments
- Be constructive and specific
- Consider user experience
- Check edge cases
- Verify test coverage

---

## 🔄 Continuous Improvement

### Regular Activities

**Weekly:**

- Review and merge PRs
- Run full test suite
- Check for dependency updates
- Update documentation

**Monthly:**

- Performance reviews
- Security audits
- Documentation reviews
- Process improvements

**Quarterly:**

- Architecture reviews
- Technical debt assessment
- Strategic planning

### Performance Monitoring

- Track app performance metrics
- Monitor error rates
- Collect user feedback
- Review analytics data
- Optimize based on findings

---

## 📞 Getting Help

### Common Issues

**Setup Problems:**

- Run `bun install` to ensure dependencies are correct
- Check environment variables are set
- Verify Node.js and Bun versions

**Build Issues:**

- Clear cache: `bun install --force`
- Restart Metro: `bun run start --clear`
- Check for dependency conflicts

**Test Failures:**

- Check test logs for specific errors
- Verify test data setup
- Ensure dependencies are up to date

### Support Resources

- Check existing documentation
- Review test files for examples
- Search issues in project
- Ask team member for guidance

---

## 📌 Important Notes

### Version Constraints

- **Node.js:** >=20.0.0
- **Bun:** >=1.0.0
- **Expo:** 52.0.49 (current, upgrade at your own risk)
- **React Native:** 0.79.0 (current, upgrade at your own risk)

### Version Upgrade Policy

- **Major versions:** Considered breaking changes, test thoroughly
- **Minor versions:** Generally safe, test if breaking changes
- **Patch versions:** Usually safe, test if bugs fixed
- **Overridden packages:** Documented in package.json `overrides`

### Current Limitations

- Calendar views limited to monthly view
- Push notifications not yet integrated
- No device calendar sync
- E2E test suite exists but not executed
- Performance metrics set but not measured

### Known Issues

- See project review documentation for detailed issue list
- All critical issues have been resolved
- Monitor for new issues during development

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
