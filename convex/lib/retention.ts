/**
 * Data Retention Configuration
 * Defines retention periods for different data types
 */
export const RETENTION_PERIODS = {
  // Activity tracking data - 1 year
  ACTIVITY_LOGS: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds

  // Deleted accounts - 30 days grace period
  DELETED_ACCOUNTS: 30 * 24 * 60 * 60 * 1000, // 30 days

  // Session/temporary data - immediate cleanup
  SESSION_DATA: 0, // Immediate

  // Rate limit entries - 24 hours
  RATE_LIMITS: 24 * 60 * 60 * 1000, // 24 hours

  // Audit logs - 2 years (for compliance)
  AUDIT_LOGS: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
} as const;

/**
 * Data types that should be cleaned up
 */
export const DATA_TYPES_FOR_CLEANUP = [
  "feeds",
  "diapers",
  "sleep",
  "growth",
  "milestones",
  "moodCheckIns",
  "journal",
] as const;

/**
 * Check if a timestamp is older than the retention period
 */
export function isExpired(timestamp: number, retentionPeriod: number): boolean {
  const now = Date.now();
  return now - timestamp > retentionPeriod;
}

/**
 * Calculate the cutoff date for data retention
 */
export function getRetentionCutoff(retentionPeriod: number): number {
  return Date.now() - retentionPeriod;
}

/**
 * Soft delete marker interface
 */
export interface SoftDeleteMarker {
  isDeleted: boolean;
  deletedAt?: number;
  deletedReason?: string;
}
