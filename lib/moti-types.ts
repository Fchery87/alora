/**
 * Type helper for Moti transitions to work around strict TypeScript checks
 * Moti v0.30.0 has overly restrictive typing for timing transitions
 */
export type MotiTransition = Record<string, any>;
