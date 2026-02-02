# Changelog

All notable changes to Alora will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Sentry error tracking integration with crash reporting
- Data export feature for GDPR compliance
- Complete API documentation
- Data retention policy with automatic cleanup
- Session management with token refresh
- Error boundary component for graceful error handling
- Rate limiting infrastructure for API protection
- Comprehensive EAS build configuration documentation

### Security

- Organization scoping hardening in all Convex mutations
- Input sanitization on all data mutations (XSS protection)
- Server-side organization ID derivation (removes client-provided org IDs)
- Data retention policy with automatic cleanup of old records

### Fixed

- Onboarding race condition preventing baby creation
- Inline styles in auth screens (converted to StyleSheet)
- Unused imports and variables cleaned up

## [1.0.0] - 2026-02-01

### Added

- **Core Features:**

  - Baby tracking (feeds, diapers, sleep, growth, milestones)
  - Journal entries with mood tracking
  - Appointment scheduling
  - Medication management
  - Calendar view with appointments and medications
  - Real-time activity feed
  - Partner support features
  - Sound/white noise player
  - Push notifications for reminders

- **Authentication & Security:**

  - Clerk authentication with organization support
  - Biometric authentication (Face ID, Touch ID)
  - Session lock with auto-timeout
  - Data encryption at rest
  - Organization-based data isolation

- **UI/UX:**

  - NativeWind/Tailwind design system
  - Glassmorphism UI components
  - Dark mode support
  - Responsive layout for all screen sizes
  - Smooth animations with Reanimated

- **Backend:**

  - Convex serverless backend
  - Real-time subscriptions
  - HIPAA-compliant data handling
  - Webhook integration with Clerk

- **Testing:**

  - 189 unit tests across 22 test files
  - Component testing with React Native Testing Library
  - Convex function testing
  - E2E testing setup with Detox

- **DevOps:**
  - EAS build configuration
  - GitHub Actions CI/CD
  - TypeScript strict mode
  - ESLint + Prettier configuration
  - Husky pre-commit hooks

### Security

- End-to-end encryption for sensitive data
- Secure token storage with expo-secure-store
- Input validation and sanitization
- Rate limiting protection
- Organization-based access control

### Technical

- React Native with Expo SDK 50
- TypeScript throughout
- Convex for backend
- Clerk for authentication
- TanStack Query for caching
- Zustand for state management
- NativeWind for styling

## [0.9.0] - 2026-01-15

### Added

- Initial beta release
- Basic baby tracking functionality
- User authentication
- Dashboard with statistics
- Settings screen

## Migration Guide

### From 0.9.0 to 1.0.0

No breaking changes. Data is automatically migrated.

## Deprecations

None currently.

## Security Advisories

None currently.

---

**Legend:**

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements

## Versioning Strategy

- **MAJOR** - Breaking changes requiring user action
- **MINOR** - New features, backward compatible
- **PATCH** - Bug fixes, backward compatible

## Release Schedule

- **Patch releases** - As needed for critical bugs
- **Minor releases** - Monthly feature updates
- **Major releases** - Quarterly with migration guides

## Support

For questions about changes or migration:

- Documentation: https://docs.alora.app
- Support: support@alora.app
- Issues: https://github.com/alora/alora/issues
