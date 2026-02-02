# Data Retention Policy

**Effective Date:** February 2026  
**Last Updated:** 2026-02-01

## Overview

Alora implements automatic data retention policies to comply with GDPR and other privacy regulations, while maintaining data necessary for app functionality.

## Retention Periods

### Activity Tracking Data

**Retention Period:** 1 year (365 days)

Includes:

- Feeding records
- Diaper changes
- Sleep tracking
- Growth measurements
- Milestones

**Reasoning:**

- Parents typically need historical data for the first year
- Pediatricians often review first-year patterns
- After 1 year, data is automatically purged

### User-Generated Content

**Retention Period:** 1 year (365 days)

Includes:

- Journal entries
- Mood check-ins
- Notes and comments

**Reasoning:**

- Provides mental health trend analysis
- 1 year sufficient for pattern recognition
- Reduces storage costs and privacy exposure

### Temporary/Session Data

**Retention Period:** Immediate cleanup (24 hours for rate limits)

Includes:

- Rate limiting entries
- Session tokens
- Temporary cache data

### Account Data

**Retention Period:** 30 days after account deletion

When a user deletes their account:

- Data is marked as "pending deletion"
- 30-day grace period allows for account recovery
- After 30 days, all data is permanently purged
- Export available during grace period

### Audit Logs

**Retention Period:** 2 years

System-level logs for compliance and debugging.

## Automatic Cleanup Schedule

**Daily:** Rate limit entries (expired >24 hours)  
**Weekly:** Activity data (older than 1 year)  
**Monthly:** Full audit and optimization

## User Rights

### Right to Data Portability

Users can export all their data at any time via:

- Settings → Data → Export Data
- JSON format provided
- Includes all tracking data, journal entries, and account info

### Right to Erasure (Right to be Forgotten)

Users can request complete data deletion:

1. Delete account in Settings
2. 30-day grace period begins
3. Data automatically purged after grace period
4. Immediate purge available upon request

### Data Minimization

Alora only collects data necessary for:

- Baby tracking functionality
- User experience improvements
- Legal compliance

No data is sold or shared with third parties except:

- Sentry (error tracking, with PII sanitized)
- Convex (database hosting)
- Clerk (authentication)

## Storage Security

All data is:

- Encrypted at rest (AES-256)
- Transmitted over TLS 1.3
- Access controlled by authentication
- Organization-scoped (multi-tenant isolation)

## Contact

For data retention inquiries or deletion requests:

- Email: privacy@alora.app
- In-app: Settings → Privacy & Security → Contact Us

## Updates

This policy may be updated periodically. Users will be notified of significant changes via:

- In-app notification
- Email (if provided)
- 30-day advance notice

---

**Compliance:** GDPR, CCPA, HIPAA (for healthcare data)  
**Review Cycle:** Annual  
**Next Review:** February 2027
