/* eslint-disable import/no-unresolved */
import { initApp } from "./helpers/initApp";

describe("Authentication Flow", () => {
  beforeAll(async () => {
    await initApp();
  });

  it("should show login screen on first launch", async () => {
    await expect(element(by.id("login-screen"))).toBeVisible();
  });

  it("should navigate to register screen", async () => {
    await element(by.id("register-button")).tap();
    await expect(element(by.id("register-screen"))).toBeVisible();
  });

  it("should show validation errors for empty fields", async () => {
    await element(by.id("login-button")).tap();
    await expect(element(by.text("Email is required"))).toBeVisible();
    await expect(element(by.text("Password is required"))).toBeVisible();
  });
});

describe("Dashboard", () => {
  beforeAll(async () => {
    await initApp();
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();
    await waitFor(element(by.id("dashboard-screen")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should display dashboard with quick actions", async () => {
    await expect(element(by.id("quick-actions-section"))).toBeVisible();
    await expect(element(by.text("Log Feed"))).toBeVisible();
    await expect(element(by.text("Log Diaper"))).toBeVisible();
    await expect(element(by.text("Log Sleep"))).toBeVisible();
  });

  it("should navigate to feed tracker when tapping Log Feed", async () => {
    await element(by.text("Log Feed")).tap();
    await expect(element(by.id("feed-tracker-screen"))).toBeVisible();
  });

  it("should show activity feed section", async () => {
    await element(by.id("back-button")).tap();
    await expect(element(by.id("activity-feed-section"))).toBeVisible();
  });
});

describe("Trackers", () => {
  beforeAll(async () => {
    await initApp();
    await performLogin();
  });

  it("should log a feed successfully", async () => {
    await element(by.text("Log Feed")).tap();
    await element(by.id("feed-type-breast")).tap();
    await element(by.id("feed-side-left")).tap();
    await element(by.id("duration-input")).typeText("15");
    await element(by.id("save-button")).tap();
    await expect(element(by.text("Feed logged successfully"))).toBeVisible();
  });

  it("should log a diaper change", async () => {
    await element(by.text("Log Diaper")).tap();
    await element(by.id("diaper-type-wet")).tap();
    await element(by.id("save-button")).tap();
    await expect(element(by.text("Diaper logged"))).toBeVisible();
  });

  it("should start and stop sleep timer", async () => {
    await element(by.text("Log Sleep")).tap();
    await element(by.id("start-timer-button")).tap();
    await expect(element(by.text("Recording..."))).toBeVisible();
    await element(by.id("stop-timer-button")).tap();
    await expect(element(by.text("Sleep logged"))).toBeVisible();
  });

  it("should show validation errors for invalid entries", async () => {
    await element(by.text("Log Feed")).tap();
    await element(by.id("save-button")).tap();
    await expect(element(by.text("Feeding type is required"))).toBeVisible();
  });
});

describe("Wellness Screen", () => {
  beforeAll(async () => {
    await initApp();
    await performLogin();
  });

  it("should display daily affirmation", async () => {
    await element(by.id("tab-wellness")).tap();
    await expect(element(by.id("daily-affirmation-card"))).toBeVisible();
  });

  it("should show mood check-in button", async () => {
    await expect(element(by.id("quick-check-in-button"))).toBeVisible();
  });

  it("should navigate to mood check-in", async () => {
    await element(by.id("quick-check-in-button")).tap();
    await expect(element(by.id("mood-check-in-screen"))).toBeVisible();
  });

  it("should select mood and save", async () => {
    await element(by.id("mood-great")).tap();
    await element(by.id("save-mood-button")).tap();
    await expect(element(by.text("Mood saved"))).toBeVisible();
  });
});

describe("Journal", () => {
  beforeAll(async () => {
    await initApp();
    await performLogin();
  });

  it("should create a new journal entry", async () => {
    await element(by.id("tab-journal")).tap();
    await element(by.id("new-entry-button")).tap();
    await expect(element(by.id("journal-form-screen"))).toBeVisible();
    await element(by.id("title-input")).typeText("My Daily Reflection");
    await element(by.id("content-input")).typeText(
      "Today was a good day with my baby. We had quality time together."
    );
    await element(by.id("save-button")).tap();
    await expect(element(by.text("Journal entry saved"))).toBeVisible();
  });

  it("should show journal entry in list", async () => {
    await expect(element(by.text("My Daily Reflection"))).toBeVisible();
  });
});

describe("Settings", () => {
  beforeAll(async () => {
    await initApp();
    await performLogin();
  });

  it("should open settings screen", async () => {
    await element(by.id("tab-settings")).tap();
    await expect(element(by.id("settings-screen"))).toBeVisible();
  });

  it("should toggle dark mode", async () => {
    await element(by.id("dark-mode-toggle")).tap();
    await expect(element(by.id("settings-screen"))).toHaveBackgroundColor(
      "#1e293b"
    );
  });

  it("should show notification settings", async () => {
    await element(by.id("notifications-section")).tap();
    await expect(element(by.id("notification-settings-screen"))).toBeVisible();
  });
});

describe("Error Handling", () => {
  beforeAll(async () => {
    await initApp();
  });

  it("should show error boundary on crash", async () => {
    await device.reloadReactNative();
    await waitFor(element(by.id("error-boundary-screen")))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.text("Something went wrong"))).toBeVisible();
    await expect(element(by.text("Try Again"))).toBeVisible();
  });
});
