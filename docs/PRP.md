# Alora Project Roadmap & Plan (PRP)

## 1. Executive Summary

This document outlines the comprehensive project roadmap for Alora, a parenting companion app. The project is divided into 6 development phases spanning 16 weeks, from foundation to launch. Each phase includes detailed tasks, timelines, dependencies, and acceptance criteria.

**Timeline:** 16 weeks (4 months)
**Team:** 2-3 developers, 1 designer
**Budget:** Bootstrapped
**Target Launch:** Q2 2026

---

## 2. Project Phases Overview

```
Phase 0: Foundation & Setup          Week 1-2
Phase 1: Core Baby Tracking         Week 3-6
Phase 2: Mental Health MVP           Week 7-9
Phase 3: Family & Sync              Week 10-11
Phase 4: Health Management           Week 12
Phase 5: Resource Library           Week 13
Phase 6: Polish & Launch Prep       Week 14-16
```

---

## 3. Phase 0: Foundation & Setup (Weeks 1-2)

### 3.1 Objectives
- Set up development environment
- Initialize Expo project with Convex backend
- Create basic UI component library
- Establish authentication flow
- Set up CI/CD pipeline

### 3.2 Tasks

**Week 1: Project Setup**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Initialize Expo project with React Native & TypeScript | Dev 1 | 2h | |
| Set up Convex backend & schema | Dev 1 | 4h | |
| Configure Bun as package manager | Dev 1 | 1h | |
| Set up ESLint, Prettier, Husky, lint-staged | Dev 1 | 2h | |
| Create project documentation structure | Dev 1 | 2h | |
| Set up Git workflow (main, develop branches) | Dev 1 | 1h | |
| Configure Convex auth (email/password) | Dev 1 | 3h | |
| **Total:** | | **15h** | |

**Week 2: UI Library & Auth Flow**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Create atomic UI components (Button, Input, Text, etc.) | Dev 2 | 8h | |
| Create theme configuration (colors, typography) | Designer | 4h | |
| Implement authentication flow (login, register, logout) | Dev 1 | 6h | |
| Create navigation structure (tabs, stacks) | Dev 2 | 4h | |
| Set up React Query for state management | Dev 1 | 2h | |
| Set up Zustand for client state | Dev 2 | 2h | |
| Create onboarding screens | Dev 2 | 4h | |
| Set up GitHub Actions CI/CD pipeline | Dev 1 | 4h | |
| Configure Sentry for error tracking | Dev 1 | 2h | |
| **Total:** | | **36h** | |

### 3.3 Dependencies
- Design system/theme approved by designer
- Convex account set up
- GitHub repository created

### 3.4 Acceptance Criteria
- ✅ Expo project builds and runs on iOS and Android
- ✅ User can register, login, and logout successfully
- ✅ Basic navigation works (tabs, stacks)
- ✅ CI/CD pipeline runs tests and linting
- ✅ Design system components implemented
- ✅ Theme configuration matches design specs

### 3.5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Expo/Convex setup issues | Medium | Medium | Follow official docs, use Expo Go for quick testing |
| Design system delays | Low | Low | Start with minimal components, iterate quickly |
| CI/CD configuration issues | Low | Low | Use proven GitHub Actions templates |

---

## 4. Phase 1: Core Baby Tracking (Weeks 3-6)

### 4.1 Objectives
- Implement all 5 baby trackers (feeds, diapers, sleep, growth, milestones)
- Create dashboard overview
- Enable real-time sync between caregivers
- Implement quick logging features

### 4.2 Tasks

**Week 3: Feed Tracker & Dashboard**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement Feed Tracker UI (types, inputs, form) | Dev 1 | 8h | |
| Create Convex queries/mutations for feeds | Dev 1 | 4h | |
| Implement Feed Card component | Dev 2 | 2h | |
| Create daily feed summary | Dev 1 | 2h | |
| Implement confetti animation on save | Dev 2 | 2h | |
| Create dashboard overview screen | Dev 1 | 4h | |
| Implement recent feeds list on dashboard | Dev 2 | 2h | |
| Add quick-action buttons (Start Breastfeed, Log Bottle) | Dev 2 | 2h | |
| **Total:** | | **26h** | |

**Week 4: Diaper & Sleep Trackers**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement Diaper Tracker UI | Dev 2 | 4h | |
| Create Convex queries/mutations for diapers | Dev 1 | 2h | |
| Implement Diaper Card component | Dev 2 | 2h | |
| Create daily diaper summary | Dev 1 | 2h | |
| Implement Sleep Tracker UI (timer, manual entry) | Dev 1 | 6h | |
| Create Convex queries/mutations for sleep | Dev 1 | 2h | |
| Implement Sleep Card component | Dev 2 | 2h | |
| Create sleep timeline visualization | Dev 2 | 4h | |
| **Total:** | | **24h** | |

**Week 5: Growth & Milestone Trackers**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement Growth Tracker UI | Dev 1 | 4h | |
| Create Convex queries/mutations for growth | Dev 1 | 2h | |
| Implement growth chart (WHO percentiles) | Dev 1 | 4h | |
| Implement Milestone Tracker UI | Dev 2 | 4h | |
| Create Convex queries/mutations for milestones | Dev 1 | 2h | |
| Implement milestone timeline | Dev 2 | 2h | |
| Add photo upload for milestones | Dev 1 | 4h | |
| Implement share milestone feature | Dev 2 | 2h | |
| **Total:** | | **24h** | |

**Week 6: Real-Time Sync & Polish**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement real-time sync via Convex subscriptions | Dev 1 | 4h | |
| Create sync status indicator component | Dev 2 | 2h | |
| Implement offline queue management | Dev 1 | 4h | |
| Add optimistic UI updates | Dev 2 | 2h | |
| Polish tracker UI (animations, transitions) | Designer | 8h | |
| Write unit tests for trackers | Dev 1 | 4h | |
| Write integration tests for sync | Dev 2 | 4h | |
| Performance testing (load test trackers) | Dev 1 | 2h | |
| **Total:** | | **30h** | |

### 4.3 Dependencies
- Phase 0 completed (UI library, auth, navigation)
- Design mocks for all trackers approved

### 4.4 Acceptance Criteria
- ✅ User can log feeds, diapers, sleep, growth, and milestones
- ✅ All trackers show recent history and daily summaries
- ✅ Real-time sync works between two users (tested locally)
- ✅ Offline mode works (changes queue and sync when connected)
- ✅ Dashboard shows overview of recent activity
- ✅ All trackers complete in <10 seconds
- ✅ Unit tests pass (coverage ≥75%)

### 4.5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Real-time sync complexity | High | Medium | Start with simple timestamp-based conflicts |
| Growth chart library issues | Medium | Medium | Use Victory Native (proven library) |
| Performance issues with real-time updates | Medium | Medium | Implement pagination and debouncing |

---

## 5. Phase 2: Mental Health MVP (Weeks 7-9)

### 5.1 Objectives
- Implement daily mood check-ins
- Create quick journal feature
- Add gentle affirmations
- Implement self-care nudges

### 5.2 Tasks

**Week 7: Mood Check-In**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement mood slider component (1-10 with emojis) | Dev 2 | 2h | |
| Implement energy slider component | Dev 2 | 2h | |
| Create tag selector component | Dev 2 | 2h | |
| Implement reflection text input (max 280 chars) | Dev 1 | 2h | |
| Add privacy toggle (share with partner) | Dev 2 | 1h | |
| Create Convex queries/mutations for mood check-ins | Dev 1 | 2h | |
| Implement mood history view | Dev 1 | 4h | |
| Add mood trends mini-chart (last 7 days) | Dev 1 | 3h | |
| **Total:** | | **18h** | |

**Week 8: Journal & Affirmations**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement Quick Journal UI | Dev 1 | 4h | |
| Create Convex queries/mutations for journal entries | Dev 1 | 2h | |
| Implement journal list (chronological) | Dev 2 | 2h | |
| Add search/filter by tags | Dev 1 | 2h | |
| Implement edit and delete functionality | Dev 2 | 2h | |
| Create affirmation display component | Dev 2 | 2h | |
| Implement daily affirmation rotation | Dev 1 | 2h | |
| Add affirmation history view | Dev 2 | 1h | |
| Seed affirmations (curated content) | Designer | 2h | |
| **Total:** | | **19h** | |

**Week 9: Self-Care Nudges & Privacy**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement self-care reminder settings | Dev 1 | 3h | |
| Create notification scheduling logic | Dev 1 | 4h | |
| Implement quiet hours configuration | Dev 2 | 2h | |
| Add reminder types (hydration, rest, nutrition) | Dev 2 | 2h | |
| Integrate Expo Notifications | Dev 1 | 3h | |
| Implement journal privacy (isPrivate flag) | Dev 2 | 2h | |
| Filter private entries from partner view | Dev 1 | 2h | |
| Write unit tests for wellness features | Dev 1 | 4h | |
| **Total:** | | **22h** | |

### 5.3 Dependencies
- Phase 1 completed (trackers working)
- Affirmation content curated and approved

### 5.4 Acceptance Criteria
- ✅ User can complete mood check-in in <30 seconds
- ✅ Mood history shows last 7 days trends
- ✅ User can create, edit, and delete journal entries
- ✅ Private journal entries hidden from partner
- ✅ User sees one affirmation per day
- ✅ Self-care reminders respect quiet hours
- ✅ Unit tests pass (coverage ≥75%)

### 5.5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Affirmation content not approved | Medium | Low | Have backup content ready |
| Notification scheduling issues | Low | Medium | Test thoroughly on iOS and Android |
| Privacy concerns (journal sharing) | Low | High | Default to private, clear UI indicators |

---

## 6. Phase 3: Family & Sync (Weeks 10-11)

### 6.1 Objectives
- Implement family creation and management
- Create invite system for caregivers
- Enable role-based permissions
- Create activity feed

### 6.2 Tasks

**Week 10: Family & Invites**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement family creation flow | Dev 1 | 3h | |
| Create Convex queries/mutations for families | Dev 1 | 2h | |
| Implement invite email generation | Dev 1 | 3h | |
| Create invite acceptance flow | Dev 2 | 3h | |
| Implement family member roles (primary, secondary, etc.) | Dev 1 | 2h | |
| Create role-based permission system | Dev 1 | 4h | |
| Implement permission checks in all mutations | Dev 1 | 4h | |
| Add family settings screen | Dev 2 | 3h | |
| **Total:** | | **24h** | |

**Week 11: Activity Feed & Sync Polish**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement activity feed component | Dev 2 | 4h | |
| Create activity type icons | Designer | 2h | |
| Implement "Today" vs "Earlier" sections | Dev 2 | 2h | |
| Add infinite scroll for feed | Dev 1 | 2h | |
| Implement pull-to-refresh | Dev 2 | 2h | |
| Add filter by activity type | Dev 1 | 2h | |
| Test multi-user sync with 3+ users | Dev 1 | 3h | |
| Write unit tests for family features | Dev 2 | 4h | |
| **Total:** | | **21h** | |

### 6.3 Dependencies
- Phase 2 completed (mental health features)
- Email service integration (or mock for MVP)

### 6.4 Acceptance Criteria
- ✅ User can create family and add baby
- ✅ User can invite partner via email
- ✅ Invited user can accept invite and join family
- ✅ Role-based permissions enforced (secondary can't delete family)
- ✅ Activity feed shows all activities across all features
- ✅ Real-time sync works for all users (tested with 3+ users)
- ✅ Unit tests pass (coverage ≥75%)

### 6.5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Email delivery issues | Medium | Medium | Use mock emails for MVP, integrate later |
| Permission bugs (security) | Medium | High | Thorough testing, code review |
| Activity feed performance with many activities | Low | Medium | Implement pagination and virtualization |

---

## 7. Phase 4: Health Management (Week 12)

### 7.1 Objectives
- Implement appointment calendar
- Create medication/vaccine log
- Add reminders for appointments and medications

### 7.2 Tasks

**Week 12: Calendar & Medications**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement calendar UI (month/week/day views) | Dev 1 | 6h | |
| Create appointment creation flow | Dev 1 | 3h | |
| Implement appointment reminders (24 hours before) | Dev 1 | 3h | |
| Create Convex queries/mutations for appointments | Dev 1 | 2h | |
| Implement medication/vaccine log UI | Dev 2 | 4h | |
| Create Convex queries/mutations for medications | Dev 1 | 2h | |
| Add medication due date calculation | Dev 1 | 2h | |
| Implement vaccine schedule (CDC recommendations) | Dev 2 | 3h | |
| Write unit tests for health features | Dev 2 | 4h | |
| **Total:** | | **29h** | |

### 7.3 Dependencies
- Phase 3 completed (family features)
- Calendar library chosen (e.g., react-native-calendars)

### 7.4 Acceptance Criteria
- ✅ User can create and view appointments
- ✅ Calendar shows appointments by month/week/day
- ✅ User receives reminder 24 hours before appointment
- ✅ User can log vaccinations with date and notes
- ✅ User can log medications with dosage and frequency
- ✅ System calculates next vaccine due date
- ✅ Unit tests pass (coverage ≥75%)

### 7.5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Calendar library limitations | Medium | Low | Use proven library (react-native-calendars) |
| Vaccine schedule complexity | Medium | Medium | Start with simplified schedule, iterate |
| Notification permission issues | Low | Medium | Test on iOS and Android, add permission prompts |

---

## 8. Phase 5: Resource Library (Week 13)

### 8.1 Objectives
- Create curated resource library
- Implement search functionality
- Add content categories

### 8.2 Tasks

**Week 13: Resource Library**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Implement resource library UI | Dev 2 | 4h | |
| Create category organization (Newborn Care, etc.) | Dev 2 | 2h | |
| Implement search functionality | Dev 1 | 3h | |
| Add favorite articles feature | Dev 2 | 2h | |
| Seed resource library content (curated) | Designer | 4h | |
| Implement article detail view | Dev 2 | 3h | |
| Add reading time estimation | Dev 1 | 1h | |
| Create Convex queries/mutations for resources | Dev 1 | 2h | |
| Write unit tests for resource library | Dev 2 | 3h | |
| **Total:** | | **24h** | |

### 8.3 Dependencies
- Phase 4 completed (health management)
- Resource content curated and approved

### 8.4 Acceptance Criteria
- ✅ User can browse resources by category
- ✅ User can search resources by title or content
- ✅ User can favorite articles
- ✅ Articles show reading time (2-5 min)
- ✅ Content is curated and expert-reviewed
- ✅ Unit tests pass (coverage ≥75%)

### 8.5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Content not approved by deadline | Medium | Low | Have backup content ready |
| Search performance issues | Low | Low | Use Convex search or simple text filtering |

---

## 9. Phase 6: Polish & Launch Prep (Weeks 14-16)

### 9.1 Objectives
- UI/UX refinement
- Performance optimization
- Security audit
- Beta testing
- Bug fixes
- Store submission preparation

### 9.2 Tasks

**Week 14: Polish & Optimization**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| UI/UX polish (animations, transitions, spacing) | Designer | 12h | |
| Implement virtualized lists for long lists | Dev 1 | 4h | |
| Optimize images and assets | Dev 2 | 4h | |
| Code splitting with React.lazy | Dev 1 | 3h | |
| Performance profiling and optimization | Dev 1 | 6h | |
| Fix identified bugs from testing | Dev 1 & 2 | 8h | |
| **Total:** | | **37h** | |

**Week 15: Security Audit & Beta Testing**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Conduct security audit (auth, permissions, data) | Dev 1 | 8h | |
| Fix security issues (critical/high) | Dev 1 | 6h | |
| Set up beta testing program (TestFlight, Internal) | Dev 2 | 4h | |
| Recruit 20-30 beta testers | Marketing | 8h | |
| Distribute beta builds | Dev 2 | 2h | |
| Collect feedback and prioritize issues | Designer | 6h | |
| Fix critical issues from beta feedback | Dev 1 & 2 | 12h | |
| **Total:** | | **46h** | |

**Week 16: Launch Prep**

| Task | Owner | Est. Time | Status |
|------|-------|-----------|--------|
| Final bug fixes and polish | Dev 1 & 2 | 8h | |
| Create app store listings (screenshots, descriptions) | Marketing | 8h | |
| Prepare privacy policy and terms of service | Legal | 4h | |
| Build production builds with EAS | Dev 1 | 4h | |
| Test production builds on real devices | Dev 2 | 6h | |
| Submit to App Store and Google Play | Dev 1 | 4h | |
| Prepare launch marketing materials | Marketing | 12h | |
| Create launch checklist and run through | PM | 4h | |
| **Total:** | | **50h** | |

### 9.3 Dependencies
- All previous phases completed
- Beta testing feedback collected
- Legal review completed

### 9.4 Acceptance Criteria
- ✅ All P0 features working as specified
- ✅ Test coverage ≥75%
- ✅ Security audit passed (no critical/high issues)
- ✅ Beta testing with 20+ families completed
- ✅ App store submission approved
- ✅ Performance targets met (<2s load, <500ms queries)
- ✅ No critical or high-severity bugs

### 9.5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| App store rejection | Low | Critical | Follow guidelines, get compliance review early |
| Critical bug found during beta | Medium | High | Allocate buffer time for bug fixes |
| Launch delays due to regulatory issues | Low | High | Legal review early, follow best practices |

---

## 10. Milestones

| Milestone | Date | Criteria | Status |
|-----------|------|----------|--------|
| M1: Foundation Complete | Week 2 | Project setup, auth flow, UI library, CI/CD | |
| M2: Baby Tracking MVP | Week 6 | All trackers working, real-time sync, dashboard | |
| M3: Mental Health MVP | Week 9 | Mood check-ins, journal, affirmations, nudges | |
| M4: Family & Sync | Week 11 | Family creation, invites, activity feed | |
| M5: Health Management | Week 12 | Calendar, appointments, medications | |
| M6: Resource Library | Week 13 | Curated content, search, favorites | |
| M7: Beta Testing | Week 15 | 20+ families testing, feedback collected | |
| M8: Launch | Week 16 | App stores approved, production build live | |

---

## 11. Resource Allocation

### 11.1 Team Roles & Responsibilities

**Dev 1 (Backend Lead)**
- Convex backend development
- Authentication & authorization
- Real-time sync implementation
- Security & permissions
- Performance optimization
- API development

**Dev 2 (Frontend Lead)**
- React Native UI development
- Navigation & routing
- Component library
- State management (React Query, Zustand)
- Animations & transitions
- E2E testing

**Designer (UI/UX)**
- Design system & theme
- Screen designs
- Iconography
- Animations & micro-interactions
- Beta testing feedback analysis
- Marketing assets

**PM (Product Manager)**
- Project coordination
- Milestone tracking
- Risk management
- Stakeholder communication
- Beta tester recruitment
- Launch coordination

### 11.2 Weekly Hours Estimate

| Week | Dev 1 | Dev 2 | Designer | PM | Total |
|------|-------|-------|----------|-----|-------|
| 1 | 15h | 0h | 0h | 4h | 19h |
| 2 | 20h | 16h | 4h | 4h | 44h |
| 3 | 18h | 8h | 0h | 4h | 30h |
| 4 | 10h | 14h | 0h | 4h | 28h |
| 5 | 12h | 12h | 0h | 4h | 28h |
| 6 | 14h | 10h | 8h | 4h | 36h |
| 7 | 11h | 7h | 0h | 4h | 22h |
| 8 | 10h | 9h | 2h | 4h | 25h |
| 9 | 13h | 9h | 0h | 4h | 26h |
| 10 | 18h | 9h | 0h | 4h | 31h |
| 11 | 9h | 12h | 2h | 4h | 27h |
| 12 | 14h | 11h | 0h | 4h | 29h |
| 13 | 8h | 16h | 4h | 4h | 32h |
| 14 | 13h | 8h | 12h | 4h | 37h |
| 15 | 14h | 6h | 6h | 12h | 38h |
| 16 | 8h | 10h | 12h | 8h | 38h |
| **Total:** | **197h** | **157h** | **50h** | **68h** | **472h** |

---

## 12. Budget Estimate

### 12.1 Development Costs

| Role | Hours | Rate | Total |
|------|-------|------|-------|
| Dev 1 (Backend Lead) | 197h | $100/h | $19,700 |
| Dev 2 (Frontend Lead) | 157h | $100/h | $15,700 |
| Designer (UI/UX) | 50h | $75/h | $3,750 |
| PM (Product Manager) | 68h | $75/h | $5,100 |
| **Subtotal:** | | | **$44,250** |

### 12.2 Infrastructure & Tools

| Item | Cost (Monthly) | Total (4 months) |
|------|----------------|-------------------|
| Convex Backend | $0 (free tier) | $0 |
| Expo EAS Builds | $29/mo | $116 |
| Sentry Error Tracking | $0 (free tier) | $0 |
| GitHub Pro (if needed) | $0 (free tier) | $0 |
| Domain/Email | $10/mo | $40 |
| **Subtotal:** | | **$156** |

### 12.3 Content & Legal

| Item | Cost | Notes |
|------|------|-------|
| Mental health expert review | $2,000 | One-time |
| Legal review (privacy policy, terms) | $3,000 | One-time |
| Content creation (affirmations, resources) | $1,500 | One-time |
| **Subtotal:** | **$6,500** | |

### 12.4 Marketing & Launch

| Item | Cost | Notes |
|------|------|-------|
| App store listing assets | $500 | |
| Launch marketing materials | $1,000 | |
| Beta tester incentives | $1,000 | (e.g., premium credits) |
| **Subtotal:** | **$2,500** | |

### 12.5 Total Budget

| Category | Total |
|----------|-------|
| Development Costs | $44,250 |
| Infrastructure & Tools | $156 |
| Content & Legal | $6,500 |
| Marketing & Launch | $2,500 |
| **Grand Total:** | **$53,406** |

---

## 13. Risk Management

### 13.1 Risk Register

| Risk | Likelihood | Impact | Priority | Mitigation Strategy | Owner |
|------|-----------|--------|----------|-------------------|-------|
| Real-time sync complexity | High | Medium | High | Start with simple timestamp-based conflicts, iterate | Dev 1 |
| App store rejection | Low | Critical | High | Follow guidelines, get compliance review early | Dev 1 |
| Scope creep | Medium | High | High | Strict MVP scope, defer P2 features | PM |
| Team burnout | Medium | Medium | Medium | Reasonable timeline, regular breaks | PM |
| Security issues | Low | Critical | High | Security audit, code review, RBAC | Dev 1 |
| Mental health content approval delays | Medium | Medium | Medium | Have backup content ready | Designer |
| Beta testing critical bugs | Medium | High | High | Allocate buffer time, early beta | Dev 1 & 2 |
| Performance issues | Medium | Medium | Medium | Performance testing, optimization | Dev 1 |
| User adoption low | Low | High | Medium | Focus on UX, beta testing feedback | PM |
| Budget overrun | Low | Medium | Medium | Regular budget tracking, contingency | PM |

### 13.2 Contingency Planning

**Time Contingency:** 2 weeks buffer built into 16-week timeline

**Budget Contingency:** 10% buffer = $5,341

**Scope Contingency:** P2 features can be deferred if needed

**Team Contingency:** Have backup contractors identified

---

## 14. Quality Assurance Plan

### 14.1 Testing Strategy

**Unit Testing**
- Jest/Vitest for component and hook testing
- Target: 75%+ coverage
- Run on every PR

**Integration Testing**
- React Native Testing Library for user flows
- Test critical paths: login → log feed → view in dashboard
- Run on every PR

**E2E Testing**
- Detox for end-to-end testing
- Test critical user journeys
- Run weekly or before releases

**Performance Testing**
- Load testing with Convex benchmarking
- Test with 100 concurrent users
- Run before beta and launch

**Security Testing**
- OWASP scan for vulnerabilities
- Penetration testing (if budget allows)
- Run before beta and launch

### 14.2 Beta Testing Plan

**Recruitment**
- 20-30 beta testers (families)
- Mix of user personas (primary, secondary, single parents)
- Provide incentives (premium credits)

**Testing Period**
- 2 weeks (Week 15)
- Collect feedback via in-app survey

**Feedback Collection**
- Daily usage metrics
- Weekly surveys
- In-app feedback form
- Direct communication channel (Slack/Discord)

**Issue Tracking**
- GitHub Issues for bugs
- Prioritize: Critical > High > Medium > Low
- Fix critical issues immediately

---

## 15. Launch Checklist

### 15.1 Technical Checklist

- [ ] All P0 features implemented and tested
- [ ] Test coverage ≥75%
- [ ] Security audit passed (no critical/high issues)
- [ ] Performance targets met:
  - [ ] App load time <2s
  - [ ] Query response <500ms
  - [ ] Mutation response <200ms
  - [ ] Real-time sync <5s
- [ ] No critical or high-severity bugs
- [ ] Offline sync working correctly
- [ ] Real-time sync tested with 3+ users
- [ ] Crash rate <0.5%
- [ ] Memory usage <300MB peak
- [ ] Bundle size <50MB

### 15.2 Legal Checklist

- [ ] Privacy policy drafted and reviewed
- [ ] Terms of service drafted and reviewed
- [ ] COPPA compliance review completed
- [ ] GDPR compliance review completed
- [ ] Mental health disclaimers in app
- [ ] Crisis helpline information in app

### 15.3 App Store Checklist

**iOS (App Store)**
- [ ] App Store Connect account set up
- [ ] App ID created
- [ ] Provisioning profiles created
- [ ] Screenshots prepared (6.5" and 5.5" devices)
- [ ] App description written
- [ ] Keywords optimized
- [ ] Privacy policy URL added
- [ ] App Store Review Guidelines followed
- [ ] Build uploaded and ready for review

**Android (Google Play)**
- [ ] Google Play Console account set up
- [ ] App signing key created
- [ ] Screenshots prepared (phone and tablet)
- [ ] Store listing complete
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL added
- [ ] Target API level ≥33
- [ ] Build uploaded and ready for review

### 15.4 Marketing Checklist

- [ ] Launch announcement prepared
- [ ] Social media assets created
- [ ] Website landing page ready
- [ ] Press release drafted
- [ ] Demo video created (1-2 minutes)
- [ ] App store screenshots optimized
- [ ] App store description optimized
- [ ] Keywords researched and added

---

## 16. Post-Launch Plan

### 16.1 Week 1-2: Launch Monitoring

- Daily: Monitor app crashes, errors, performance
- Daily: Check app store reviews
- Daily: Respond to user feedback
- Weekly: Review analytics and metrics
- Weekly: Prioritize bug fixes and improvements

### 16.2 Week 3-4: Iteration 1

- Fix critical bugs
- Address top user requests
- Release hotfix version (1.0.1)
- Plan next feature sprint

### 16.3 Month 2-3: Growth & Iteration

- Release version 1.1 with improvements
- Implement P1 features (activity feed, medications, resources)
- Analyze user behavior and optimize onboarding
- Plan premium features

### 16.4 Month 4-6: Premium Features

- Implement premium monetization
- Add advanced analytics
- Add additional caregiver support
- Launch marketing campaign for premium

---

## 17. Success Metrics

### 17.1 Launch Success (Week 1)

| Metric | Target | Measure |
|--------|--------|---------|
| App store approval | ✅ | App live in stores |
| No critical bugs | ✅ | Crash rate <0.5% |
| Positive reviews | ≥4.0 stars | App store rating |

### 17.2 User Success (Month 3)

| Metric | Target | Measure |
|--------|--------|---------|
| Active families | 100+ | Families with ≥1 activity/week |
| Retention (30 days) | ≥70% | Users active after 30 days |
| NPS score | ≥40 | Net Promoter Score survey |

### 17.3 Engagement Success (Month 3)

| Metric | Target | Measure |
|--------|--------|---------|
| Log entries/user/day | ≥3 | Average logs per user |
| Mood check-ins/week | ≥3 | Average check-ins per user |
| Premium conversion | ≥10% | Families on premium plan |

---

## 18. Open Questions & Dependencies

### 18.1 Open Questions

1. **Affirmation Content:** Should we license existing content or develop in-house? (Decision: Week 2)
2. **Premium Pricing:** What is optimal price point? ($6.99-$9.99/month - research needed)
3. **Content Review:** Who will review mental health content? (Recruitment needed: Week 4)
4. **Email Service:** Should we use SendGrid, AWS SES, or mock emails for MVP? (Decision: Week 6)
5. **Calendar Library:** Should we use react-native-calendars or build custom? (Decision: Week 10)

### 18.2 External Dependencies

- Convex account and setup
- Expo account and EAS access
- GitHub repository (private)
- Sentry account for error tracking
- App Store Connect account
- Google Play Console account
- Mental health expert review (by Week 8)
- Legal review (by Week 12)
- Beta testers (by Week 14)

---

## 19. Appendix: Timeline Visual

```
Week 1-2    Week 3-6       Week 7-9       Week 10-11     Week 12       Week 13       Week 14-16
│───────│───────────────│───────────────│───────────────│──────────────│──────────────│───────────────│
Foundation  Baby Tracking  Mental Health  Family & Sync  Health Mgmt   Resources     Launch Prep
            │             │              │              │              │              │
M1: Done    M2: Done      M3: Done       M4: Done       M5: Done      M6: Done      M8: Launch
                                                          │
                                                         M7: Beta
```

---

**Document Version:** 1.0
**Last Updated:** January 19, 2026
**Next Review:** Weekly during project sprints
