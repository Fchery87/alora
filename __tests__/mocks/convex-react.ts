import { vi } from "vitest"

const convexClient = {
  query: vi.fn(async (fn: any, args: any) => fn(args)),
  mutation: vi.fn(async (fn: any, args: any) => fn(args)),
}

export function useConvex() {
  return convexClient as any
}

export default {
  useConvex,
}

