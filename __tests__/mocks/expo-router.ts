import { vi } from "vitest"

export function useRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    canGoBack: vi.fn(() => true),
  } as any
}

export function Redirect(_props: { href: string }) {
  return null
}

export function Stack(_props: any) {
  return null
}

export function Tabs(_props: any) {
  return null
}

export const Link = (_props: any) => null

export default {
  useRouter,
  Redirect,
  Stack,
  Tabs,
  Link,
}

