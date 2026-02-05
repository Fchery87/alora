import { vi } from "vitest"

export async function authenticateAsync() {
  return { success: true }
}

export const hasHardwareAsync = vi.fn(async () => true)
export const isEnrolledAsync = vi.fn(async () => true)

export default {
  authenticateAsync,
  hasHardwareAsync,
  isEnrolledAsync,
}

