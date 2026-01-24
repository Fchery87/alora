import { expect } from "detox";
import { device } from "detox";

export async function initApp(): Promise<void> {
  await device.launchApp({
    newInstance: true,
    permissions: {
      notifications: "YES",
      camera: "YES",
      photos: "YES",
    },
  });
  await device.reloadReactNative();
}

export async function performLogin(): Promise<void> {
  try {
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();
    const dashboardElement = await waitFor(element(by.id("dashboard-screen")));
    expect(dashboardElement)
      .toBeVisible();
  } catch {
    console.log("Already logged in or login failed");
  }
}

export async function navigateToTab(tabId: string): Promise<void> {
  await element(by.id(`tab-${tabId}`)).tap();
}

export async function waitFor(element: any): Promise<any> {
  return require("detox").waitFor(element);
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
