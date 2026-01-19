# Alora Product Requirements Document (PRD)

## 1. Executive Summary

Alora is a comprehensive, parent-centered mobile application designed to support new parents—particularly in the earliest, most demanding months of their baby's life. It blends baby care tracking with parental mental health and relationship support, becoming the single integrated companion for early parenthood.

**Target Launch:** Q2 2026
**Platform:** iOS and Android (React Native Expo)
**Monetization:** Freemium model with premium family plan

---

## 2. Product Vision & Goals

### Vision Statement
To become the most trusted companion for new parents, reducing mental load while supporting both baby's needs and parents' emotional wellbeing.

### Primary Goals
1. **Reduce Mental Load** - Centralize tracking and information so parents can focus on caregiving
2. **Support Parental Mental Health** - Provide tools to monitor and support emotional wellbeing
3. **Enable Shared Parenting** - Help partners stay synchronized and work as a team
4. **Build Trust** - Create a safe, inclusive, and judgment-free space for all types of families

### Success Metrics
- **User Engagement:** Average 3+ log entries per user per day
- **Retention:** 70% retention after 30 days
- **Satisfaction:** NPS score ≥ 40
- **Family Adoption:** 100+ active families within 3 months of launch

---

## 3. Target Users

### Primary Users

#### New Parents
- **Demographics:** Ages 25-40, expecting or with newborn (0-12 months)
- **Pain Points:** Sleep deprivation, memory overload, social isolation, feeling overwhelmed
- **Goals:** Track baby's needs, monitor patterns, stay organized, get emotional support

#### Primary Caregivers
- **Demographics:** Often stay-at-home parents, managing daily baby care
- **Pain Points:** Remembering all details, communicating with partner who works
- **Goals:** Quick logging, easy sharing, clear summaries

#### Secondary Partners
- **Demographics:** Working partners, co-parents
- **Pain Points:** Feeling out of the loop, asking "what happened today?" constantly
- **Goals:** Stay informed, contribute to tracking, support primary caregiver

### Secondary Users
- **Grandparents/Relatives:** Occasional caregivers who want to stay updated
- **Sitters/Nannies:** Need clear instructions and ability to log activities
- **Single Parents by Choice:** Need all features without partner-focused elements

### User Personas

**Emma, Primary Caregiver**
- 32, first-time mom, on maternity leave
- Stressed about tracking everything
- Wants quick, easy logging
- Values mental health support

**Alex, Working Partner**
- 34, first-time dad, works 9-5
- Wants to stay connected to baby's day
- Prefers to check updates on phone
- Wants to support Emma emotionally

**Jordan, LGBTQ+ Co-Parent**
- 28, co-parenting with partner
- Uses inclusive language
- Needs non-gendered design
- Values shared responsibility equally

---

## 4. User Stories

### Epic 1: Baby Tracking

#### Feeding Tracker
**US-1.1** As a primary caregiver, I want to log breast, bottle, or pumping sessions so I can track my baby's nutrition.

**Acceptance Criteria:**
- User can select feeding type: Breast, Bottle, Pumping
- For breastfeeding: user can select side (left/right/both) and duration
- For bottle feeding: user can input amount in oz or mL with quick presets (2oz, 4oz, 6oz, 8oz)
- For pumping: user can input amount pumped and duration
- System automatically records timestamp (editable)
- User can add optional notes
- Feed appears in dashboard and feed history immediately
- Daily summary shows total feeds and total volume

**Priority:** P0 (MVP)

---

**US-1.2** As a working partner, I want to see what my baby ate today so I know how they're doing.

**Acceptance Criteria:**
- Feed history shows all feeds for selected baby
- Feeds are sorted chronologically (newest first)
- Each feed shows: time, type, amount/duration, who logged it
- User can filter by date range
- User can see daily summary at top

**Priority:** P0 (MVP)

---

#### Diaper Tracker
**US-1.3** As a caregiver, I want to log wet and dirty diapers so I can monitor my baby's hydration and digestion.

**Acceptance Criteria:**
- User can select diaper type: Wet, Dirty, Mixed
- User can select time (defaults to current)
- User can add optional notes
- Diaper appears in dashboard immediately
- Daily count shows wet/dirty/mixed totals
- Visual indicator if diaper count is unusual (outside typical range)

**Priority:** P0 (MVP)

---

#### Sleep Tracker
**US-1.4** As a sleep-deprived parent, I want to track naps and nighttime sleep so I can identify patterns and regressions.

**Acceptance Criteria:**
- User can start/stop sleep timer for naps or nighttime sleep
- User can manually log sleep sessions with start/end times
- Visual timeline shows sleep throughout the day
- Daily summary shows total sleep time
- User can see sleep trends over time (last 7 days)

**Priority:** P0 (MVP)

---

#### Growth Tracker
**US-1.5** As a parent, I want to record my baby's weight, height, and head circumference so I can monitor growth over time.

**Acceptance Criteria:**
- User can input: date, weight (lbs/kg), height (inches/cm), head circumference (inches/cm)
- Only relevant fields required (user can skip any field)
- Growth appears in dashboard immediately
- Growth chart visualization (line chart over time)
- Growth percentiles (using WHO growth standards)

**Priority:** P0 (MVP)

---

#### Milestone Tracker
**US-1.6** As a proud parent, I want to record milestones like first smile or first roll so I can cherish these memories.

**Acceptance Criteria:**
- User can create milestone with: title, date, optional photo, optional notes
- Milestones appear in timeline view
- Milestones are sorted chronologically
- User can view milestone gallery with photos
- User can share milestone with partner

**Priority:** P0 (MVP)

---

### Epic 2: Mental Health Support

#### Daily Mood Check-In
**US-2.1** As a new parent, I want to quickly log my mood and energy levels so I can track my emotional wellbeing.

**Acceptance Criteria:**
- User can select mood score (1-10) with slider
- Mood has emoji labels (😢 😟 😐 🙂 😊)
- User can select energy score (1-10) with slider
- User can select tags: Grateful, Hard Day, Funny Moment, Tired, Anxious, Accomplished, Loved
- Optional text reflection (max 280 characters)
- User can choose to share with partner or keep private
- Check-in completes in <30 seconds
- Mood history view shows last 7 days trend

**Priority:** P0 (MVP)

---

#### Gentle Affirmations
**US-2.2** As a struggling parent, I want to receive compassionate affirmations so I feel supported and understood.

**Acceptance Criteria:**
- System shows one affirmation per day on app open
- Affirmations are short (1-2 sentences)
- Affirmations use non-judgmental language
- Categories: Self-compassion, Normalization, Celebration
- User can "favorite" affirmations
- User can view affirmation history
- Content is curated/verified by mental health experts

**Priority:** P0 (MVP)

---

#### Quick Journal
**US-2.3** As a reflective parent, I want to journal my thoughts and feelings so I can process the emotional journey of parenting.

**Acceptance Criteria:**
- User can create journal entry with: title (optional), content (required), tags
- Content supports multi-line text (no strict limit)
- User can select tags: Grateful, Hard Day, Funny Moment, Tired, Anxious, Accomplished, Loved
- User can mark entry as "private" (only visible to author) or "shared" (visible to partner)
- Journal entries are sorted chronologically
- User can edit and delete their entries
- Search by tags or content text

**Priority:** P0 (MVP)

---

#### Self-Care Nudges
**US-2.4** As a busy parent, I want gentle reminders to take care of myself so I don't burn out.

**Acceptance Criteria:**
- System sends reminders based on patterns:
  - "It's been a while since you logged any rest. Have you had a moment to yourself today?"
  - "Don't forget to hydrate and eat something nourishing."
- Reminders are non-judgmental and supportive
- User can configure: enabled/disabled, frequency, quiet hours
- Reminders respect quiet hours (e.g., 8pm-8am)
- User can dismiss or "snooze" reminders

**Priority:** P0 (MVP)

---

### Epic 3: Family & Sync

#### Family Creation
**US-3.1** As a new user, I want to create my family so I can start tracking my baby's activities.

**Acceptance Criteria:**
- User enters family name (optional)
- User adds baby: name, birthdate, gender (optional)
- System creates family and baby records
- User becomes primary caregiver with full permissions
- Family creation takes <2 minutes

**Priority:** P0 (MVP)

---

#### Invite Partner
**US-3.2** As a primary caregiver, I want to invite my partner so we can share tracking responsibilities.

**Acceptance Criteria:**
- User enters partner's email
- System sends invitation email with secure link
- Partner clicks link, creates account, joins family
- Partner role defaults to "secondary caregiver" (read/write, no family management)
- Both users can see all family data in real-time
- Invited user receives push notification

**Priority:** P0 (MVP)

---

#### Real-Time Sync
**US-3.3** As a working partner, I want to see updates in real-time so I always know what's happening at home.

**Acceptance Criteria:**
- When one user logs an activity, it appears on all connected devices within 5 seconds
- System shows sync status indicator (connected/syncing/offline)
- Offline mode: changes queue locally and sync when reconnected
- System shows number of pending changes
- Conflicts resolved automatically by timestamp

**Priority:** P0 (MVP)

---

#### Activity Feed
**US-3.4** As a partner, I want to see an activity feed so I can quickly catch up on what happened today.

**Acceptance Criteria:**
- Activity feed shows all logged activities in reverse chronological order
- Each activity shows: type, time, who logged it, key details
- Activities include: feeds, diapers, sleep, milestones, journal entries, mood check-ins
- User can filter by activity type
- User can see "today" vs "earlier" sections
- Scroll to load more (infinite pagination)

**Priority:** P1 (MVP+)

---

### Epic 4: Health Management

#### Appointment Calendar
**US-4.1** As a parent, I want to schedule and track pediatric appointments so I don't miss important visits.

**Acceptance Criteria:**
- User can create appointment: title, date, time, location, notes
- User can set appointment type: pediatrician, follow-up, health task
- Calendar view shows appointments by month/week/day
- User can mark appointments as completed
- System sends reminder 24 hours before
- Appointments sync with family members

**Priority:** P0 (MVP)

---

#### Medication/Vaccine Log
**US-4.2** As a parent, I want to track vaccinations and medications so I have a complete health record.

**Acceptance Criteria:**
- User can log vaccine: name, date, notes, next dose date (optional)
- User can log medication: name, dosage, frequency, start date, notes
- System shows vaccination timeline
- System calculates next vaccine due date (based on CDC schedule)
- User can set reminder for next dose

**Priority:** P1 (MVP+)

---

### Epic 5: Resource Library

#### Curated Content
**US-5.1** As a new parent, I want to access bite-sized articles so I can learn about newborn care and postpartum recovery.

**Acceptance Criteria:**
- Resource library shows articles by category
- Categories: Newborn Care, Postpartum Recovery, Sleep Hygiene, Partner Support
- Articles are short (2-5 min read)
- Content is developed with medical experts
- User can favorite articles
- User can search articles by title or content

**Priority:** P1 (MVP+)

---

### Epic 6: Premium Features (Post-MVP)

#### Advanced Analytics
**US-6.1** As a premium subscriber, I want to see detailed analytics so I can understand long-term patterns.

**Acceptance Criteria:**
- User can view 30/60/90 day trends for feeds, sleep, growth, mood
- User can correlate data (e.g., sleep vs mood, feeds vs growth)
- User can export data as CSV or PDF
- User can compare multiple babies (if applicable)

**Priority:** P2 (Post-MVP)

---

#### Additional Caregivers
**US-6.2** As a premium subscriber, I want to add more caregivers (grandparents, sitters) so my whole support network can help.

**Acceptance Criteria:**
- User can invite up to 5 additional caregivers
- Each caregiver has customizable permissions
- Caregivers can be set to "read-only" or "limited write"

**Priority:** P2 (Post-MVP)

---

## 5. Feature Prioritization

### MVP (Must-Have) - P0
- ✅ Baby tracking: Feeds, Diapers, Sleep, Growth, Milestones
- ✅ Mental health: Mood check-ins, Affirmations, Quick journal, Self-care nudges
- ✅ Family: Create family, Invite partner, Real-time sync
- ✅ Health: Appointment calendar
- ✅ Authentication: Email/password, Secure sessions
- ✅ Offline support: Queue changes, sync when connected

### MVP+ (Should-Have) - P1
- 🔄 Activity feed
- 🔄 Medication/vaccine log
- 🔄 Resource library (curated content)
- 🔄 Search functionality
- 🔄 Data export

### Post-MVP (Nice-to-Have) - P2
- 📋 Advanced analytics and trends
- 📋 Multiple caregivers beyond partner
- 📋 Partner support prompts
- 📋 Soothing sound library
- 📋 Community features

---

## 6. Non-Functional Requirements

### Performance
- App load time: <2 seconds
- Query response time: <500ms
- Mutation response time: <200ms
- Real-time sync delay: <5 seconds
- App size: <50MB

### Reliability
- Uptime: 99.9%
- Crash rate: <0.5%
- Offline sync success rate: >95%
- Data loss: Zero (must have backup/recovery)

### Security
- End-to-end encryption in transit (TLS 1.3)
- Encryption at rest (AES-256)
- Secure authentication (Convex Auth)
- Role-based access control
- Audit trail for all data changes
- No PII in analytics
- GDPR compliance

### Usability
- Onboarding: <3 minutes to complete
- Feed log: <10 seconds
- Mood check-in: <30 seconds
- Intuitive UI (minimal cognitive load)
- Accessible: WCAG 2.1 AA compliant
- Inclusive language (gender-neutral)

### Scalability
- Support 1,000 families at launch
- 5 concurrent users per family (5,000 concurrent connections)
- 10,000 operations/day
- Geographic expansion support (post-MVP)

---

## 7. Constraints & Assumptions

### Constraints
- Budget: Limited development budget (bootstrapped)
- Timeline: 16 weeks from start to launch
- Team: Small team (2-3 developers, 1 designer)
- Platform: iOS and Android (via Expo)
- Legal: Must comply with COPPA (children's privacy) and GDPR

### Assumptions
- Users have smartphones (iOS 15+ or Android 10+)
- Users have basic internet connectivity
- Users are comfortable with mobile apps
- Mental health content will be reviewed by clinical experts
- No direct integration with healthcare systems at launch
- Free tier is sufficient for most families initially

---

## 8. Dependencies

### External Dependencies
- **Convex Backend:** Real-time database, authentication, sync
- **Expo:** React Native framework, build pipeline, distribution
- **React Navigation:** In-app navigation
- **React Query:** Server state management
- **Zustand:** Client state management
- **Expo Notifications:** Push notifications
- **Apple App Store & Google Play:** Distribution

### Internal Dependencies
- Clinical expert review for mental health content (by Week 8)
- Legal review for privacy policy and terms (by Week 12)
- Beta testing with 20-30 families (by Week 14)

---

## 9. Risks & Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Convex scaling issues | Medium | High | Load testing before launch, monitor closely |
| Real-time sync complexity | High | Medium | Start with simple timestamp-based conflicts |
| Offline sync data loss | Medium | High | Robust error handling, retry logic, user alerts |
| App store rejection | Low | Critical | Follow store guidelines, get compliance review early |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low user engagement | Medium | High | Focus on UX, beta testing, iterate quickly |
| Competitor launch | Medium | Medium | Differentiate with mental health focus |
| Mental health concerns | Low | Critical | Clear disclaimers, expert review, crisis resources |
| User retention issues | Medium | High | Onboarding optimization, in-app guidance, analytics |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Insufficient funding | Medium | Critical | Keep MVP lean, monetize early (freemium) |
| Legal/compliance issues | Low | Critical | Legal review early, follow best practices |
| Team burnout | Medium | Medium | Reasonable timeline, agile sprints, regular breaks |

---

## 10. Success Criteria

### Launch Criteria (All must be met)
- ✅ All P0 features fully implemented and tested
- ✅ Test coverage ≥75%
- ✅ Security audit passed (no critical/high issues)
- ✅ Beta testing with 20+ families completed
- ✅ App store submission approved
- ✅ Documentation complete (user guide, privacy policy, terms)

### Post-Launch Success (3 months)
- ✅ 100+ active families
- ✅ 70% retention after 30 days
- ✅ NPS score ≥40
- ✅ App store rating ≥4.0 stars
- ✅ <10% crash rate
- ✅ 10+ families convert to premium

---

## 11. Open Questions

1. **Affirmation Content:** Should we license existing affirmation content or develop in-house? (Decision needed: Week 2)
2. **Premium Pricing:** What is the optimal price point? ($6.99-$9.99/month research needed)
3. **Data Retention:** What is the default data retention period? (2 years recommended)
4. **Clinical Review:** Who will review mental health content? (Recruitment needed)
5. **COPPA Compliance:** What specific measures are needed for children's privacy? (Legal review needed)

---

## 12. Appendix

### A. Competitive Analysis Summary
- **Baby Tracker Apps:** Focus primarily on baby data, lack mental health support
- **Mental Health Apps:** Ignore caregiving logistics, lack practical tracking
- **Alora Differentiator:** Holistic approach supporting both baby and parents

### B. User Research Insights
- Parents feel overwhelmed by "remembering everything"
- Partners feel out of the loop when working
- Mental health is a major concern but rarely discussed openly
- Existing apps feel "clinical" or "judgmental"

### C. Glossary
- **Feed:** Breast, bottle, or pumping session
- **Diaper:** Wet, dirty, or mixed diaper change
- **Mood Check-In:** Daily emotional and energy level assessment
- **Affirmation:** Short, supportive message
- **Family:** Household/parenting unit (can be solo parent, couple, co-parents)
- **Caregiver:** Anyone who provides care to the baby (parent, grandparent, sitter)

---

**Document Version:** 1.0
**Last Updated:** January 19, 2026
**Next Review:** Weekly during development sprint planning
