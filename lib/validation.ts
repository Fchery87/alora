/**
 * Validation schemas and utilities for form inputs
 * Provides validation rules for all tracker forms
 */

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// FEEDING VALIDATION
// ============================================================================

export interface FeedFormData {
  type: "breast" | "formula" | "solid";
  duration: string;
  side?: "left" | "right" | "both";
  notes?: string;
}

export function validateFeed(data: Partial<FeedFormData>): ValidationResult {
  const errors: ValidationError[] = [];

  // Type validation (required)
  if (!data.type) {
    errors.push({ field: "type", message: "Feeding type is required" });
  }

  // Duration validation (required, must be positive)
  if (!data.duration || data.duration.trim() === "") {
    errors.push({ field: "duration", message: "Duration is required" });
  } else {
    const duration = parseInt(data.duration, 10);
    if (isNaN(duration)) {
      errors.push({ field: "duration", message: "Duration must be a number" });
    } else if (duration <= 0) {
      errors.push({
        field: "duration",
        message: "Duration must be greater than 0",
      });
    } else if (duration > 480) {
      // 8 hours max
      errors.push({
        field: "duration",
        message: "Duration seems too long (max 480 minutes)",
      });
    }
  }

  // Side validation (required for breastfeeding)
  if (data.type === "breast" && !data.side) {
    errors.push({ field: "side", message: "Side selection is required" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// DIAPER VALIDATION
// ============================================================================

export interface DiaperFormData {
  type: "wet" | "solid" | "mixed";
  color?: "yellow" | "orange" | "green" | "brown" | "red" | null;
  notes?: string;
}

export function validateDiaper(
  data: Partial<DiaperFormData>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Type validation (required)
  if (!data.type) {
    errors.push({ field: "type", message: "Diaper type is required" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// SLEEP VALIDATION
// ============================================================================

export interface SleepFormData {
  type: "nap" | "night" | "day";
  startTime: Date;
  endTime?: Date | null;
  duration?: number; // in minutes
}

export function validateSleep(data: Partial<SleepFormData>): ValidationResult {
  const errors: ValidationError[] = [];

  // Type validation (required)
  if (!data.type) {
    errors.push({ field: "type", message: "Sleep type is required" });
  }

  // Start time validation (required)
  if (!data.startTime || !(data.startTime instanceof Date)) {
    errors.push({ field: "startTime", message: "Start time is required" });
  }

  // End time validation
  if (data.endTime) {
    if (data.startTime && data.endTime < data.startTime) {
      errors.push({
        field: "endTime",
        message: "End time must be after start time",
      });
    }
  }

  // Duration validation (if sleep is stopped)
  if (data.endTime && data.duration !== undefined) {
    if (data.duration <= 0) {
      errors.push({
        field: "duration",
        message: "Duration must be greater than 0",
      });
    } else if (data.duration > 720) {
      // 12 hours max
      errors.push({
        field: "duration",
        message: "Duration seems too long (max 720 minutes)",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// GROWTH VALIDATION
// ============================================================================

export interface GrowthFormData {
  type: "weight" | "length" | "head_circumference";
  value: string;
  unit: string;
  date: string;
  notes?: string;
}

export function validateGrowth(
  data: Partial<GrowthFormData>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Type validation (required)
  if (!data.type) {
    errors.push({ field: "type", message: "Measurement type is required" });
  }

  // Value validation (required, must be positive)
  if (!data.value || data.value.trim() === "") {
    errors.push({ field: "value", message: "Value is required" });
  } else {
    const value = parseFloat(data.value);
    if (isNaN(value)) {
      errors.push({ field: "value", message: "Value must be a number" });
    } else if (value <= 0) {
      errors.push({ field: "value", message: "Value must be greater than 0" });
    } else {
      // Type-specific validation
      switch (data.type) {
        case "weight":
          if (data.unit === "kg" && (value < 0.5 || value > 20)) {
            errors.push({
              field: "value",
              message: "Weight seems unrealistic (0.5-20 kg)",
            });
          } else if (data.unit === "lb" && (value < 1 || value > 45)) {
            errors.push({
              field: "value",
              message: "Weight seems unrealistic (1-45 lbs)",
            });
          }
          break;
        case "length":
          if (data.unit === "cm" && (value < 30 || value > 120)) {
            errors.push({
              field: "value",
              message: "Length seems unrealistic (30-120 cm)",
            });
          } else if (data.unit === "in" && (value < 12 || value > 48)) {
            errors.push({
              field: "value",
              message: "Length seems unrealistic (12-48 in)",
            });
          }
          break;
        case "head_circumference":
          if (data.unit === "cm" && (value < 20 || value > 55)) {
            errors.push({
              field: "value",
              message: "Head circumference seems unrealistic (20-55 cm)",
            });
          } else if (data.unit === "in" && (value < 8 || value > 22)) {
            errors.push({
              field: "value",
              message: "Head circumference seems unrealistic (8-22 in)",
            });
          }
          break;
      }
    }
  }

  // Unit validation (required)
  if (!data.unit || data.unit.trim() === "") {
    errors.push({ field: "unit", message: "Unit is required" });
  }

  // Date validation (required)
  if (!data.date || data.date.trim() === "") {
    errors.push({ field: "date", message: "Date is required" });
  } else {
    const date = new Date(data.date);
    const now = new Date();
    if (isNaN(date.getTime())) {
      errors.push({ field: "date", message: "Invalid date format" });
    } else if (date > now) {
      errors.push({ field: "date", message: "Date cannot be in the future" });
    } else if (date < new Date(now.getFullYear() - 5, 0, 1)) {
      errors.push({ field: "date", message: "Date is too far in the past" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// MILESTONE VALIDATION
// ============================================================================

export interface MilestoneFormData {
  title: string;
  description?: string;
  category: "motor" | "cognitive" | "language" | "social" | "custom";
  date?: string;
  ageMonths?: number;
  isCustom: boolean;
}

export function validateMilestone(
  data: Partial<MilestoneFormData>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Title validation (required)
  if (!data.title || data.title.trim() === "") {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.trim().length < 2) {
    errors.push({
      field: "title",
      message: "Title must be at least 2 characters",
    });
  } else if (data.title.length > 100) {
    errors.push({
      field: "title",
      message: "Title must be less than 100 characters",
    });
  }

  // Category validation (required)
  if (!data.category) {
    errors.push({ field: "category", message: "Category is required" });
  }

  // Date validation (optional, but must be valid if provided)
  if (data.date && data.date.trim() !== "") {
    const date = new Date(data.date);
    const now = new Date();
    if (isNaN(date.getTime())) {
      errors.push({ field: "date", message: "Invalid date format" });
    } else if (date > now) {
      errors.push({ field: "date", message: "Date cannot be in the future" });
    }
  }

  // Age months validation (optional, but must be valid if provided)
  if (data.ageMonths !== undefined) {
    if (isNaN(data.ageMonths)) {
      errors.push({ field: "ageMonths", message: "Age must be a number" });
    } else if (data.ageMonths < 0) {
      errors.push({ field: "ageMonths", message: "Age cannot be negative" });
    } else if (data.ageMonths > 60) {
      errors.push({ field: "ageMonths", message: "Age seems unrealistic" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// JOURNAL VALIDATION
// ============================================================================

export interface JournalFormData {
  title?: string;
  content: string;
  tags?: string[];
  isGratitude?: boolean;
  isWin?: boolean;
}

export function validateJournal(
  data: Partial<JournalFormData>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Content validation (required)
  if (!data.content || data.content.trim() === "") {
    errors.push({ field: "content", message: "Content is required" });
  } else if (data.content.trim().length < 10) {
    errors.push({
      field: "content",
      message: "Content must be at least 10 characters",
    });
  } else if (data.content.length > 5000) {
    errors.push({
      field: "content",
      message: "Content must be less than 5000 characters",
    });
  }

  // Title validation (optional, but must be valid if provided)
  if (data.title && data.title.trim() !== "") {
    if (data.title.length > 200) {
      errors.push({
        field: "title",
        message: "Title must be less than 200 characters",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// MOOD VALIDATION
// ============================================================================

export interface MoodFormData {
  mood: "great" | "good" | "okay" | "low" | "struggling";
  energy?: "high" | "medium" | "low";
  anxiety?: boolean | null;
  notes?: string;
}

export function validateMood(data: Partial<MoodFormData>): ValidationResult {
  const errors: ValidationError[] = [];

  // Mood validation (required)
  if (!data.mood) {
    errors.push({ field: "mood", message: "Mood selection is required" });
  }

  // Notes validation (optional)
  if (data.notes && data.notes.length > 500) {
    errors.push({
      field: "notes",
      message: "Notes must be less than 500 characters",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// USER REGISTRATION VALIDATION
// ============================================================================

export interface UserRegistrationFormData {
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  acceptTerms: boolean;
}

export function validateUserRegistration(
  data: Partial<UserRegistrationFormData>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Email validation (required)
  if (!data.email || data.email.trim() === "") {
    errors.push({ field: "email", message: "Email is required" });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    }
  }

  // Password validation (required)
  if (!data.password || data.password.trim() === "") {
    errors.push({ field: "password", message: "Password is required" });
  } else {
    if (data.password.length < 8) {
      errors.push({
        field: "password",
        message: "Password must be at least 8 characters",
      });
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one uppercase letter",
      });
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one lowercase letter",
      });
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one number",
      });
    }
  }

  // Name validation (optional, but must be valid if provided)
  if (data.name && data.name.trim() !== "") {
    if (data.name.length < 2) {
      errors.push({
        field: "name",
        message: "Name must be at least 2 characters",
      });
    } else if (data.name.length > 100) {
      errors.push({
        field: "name",
        message: "Name must be less than 100 characters",
      });
    }
  }

  // Avatar URL validation (optional)
  if (data.avatarUrl && data.avatarUrl.trim() !== "") {
    try {
      new URL(data.avatarUrl);
    } catch {
      errors.push({ field: "avatarUrl", message: "Invalid photo URL" });
    }
  }

  // Terms acceptance (required)
  if (!data.acceptTerms) {
    errors.push({
      field: "acceptTerms",
      message: "You must accept the terms and conditions",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// APPOINTMENT VALIDATION
// ============================================================================

export interface AppointmentFormData {
  title: string;
  description?: string;
  type: "pediatrician" | "checkup" | "vaccine" | "wellness" | "custom";
  date: number;
  time: number;
  location?: string;
  notes?: string;
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
}

export function validateAppointment(
  data: Partial<AppointmentFormData>
): { success: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Title validation (required)
  if (!data.title || data.title.trim() === "") {
    errors.title = "Title is required";
  } else if (data.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  // Type validation (required)
  if (!data.type) {
    errors.type = "Appointment type is required";
  }

  // Date validation (required)
  if (!data.date) {
    errors.date = "Date is required";
  }

  // Reminder validation (optional, but must be valid if provided)
  if (data.reminderEnabled && data.reminderMinutesBefore !== undefined) {
    if (data.reminderMinutesBefore < 5 || data.reminderMinutesBefore > 10080) {
      errors.reminderMinutesBefore = "Reminder must be between 5 minutes and 1 week";
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// MEDICATION VALIDATION
// ============================================================================

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: number;
  endDate?: number;
  type: "prescription" | "otc" | "supplement";
  notes?: string;
  reminderEnabled?: boolean;
  reminderTime?: string;
}

export function validateMedication(
  data: Partial<MedicationFormData>
): { success: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Name validation (required)
  if (!data.name || data.name.trim() === "") {
    errors.name = "Medication name is required";
  } else if (data.name.length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  // Dosage validation (required)
  if (!data.dosage || data.dosage.trim() === "") {
    errors.dosage = "Dosage is required";
  }

  // Frequency validation (required)
  if (!data.frequency || data.frequency.trim() === "") {
    errors.frequency = "Frequency is required";
  }

  // Start date validation (required)
  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// BABY VALIDATION
// ============================================================================

export interface BabyFormData {
  name: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  photoUrl?: string;
}

export function validateBaby(data: Partial<BabyFormData>): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation (required)
  if (!data.name || data.name.trim() === "") {
    errors.push({ field: "name", message: "Baby's name is required" });
  } else if (data.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters",
    });
  } else if (data.name.length > 50) {
    errors.push({
      field: "name",
      message: "Name must be less than 50 characters",
    });
  }

  // Birth date validation (required)
  if (!data.birthDate || data.birthDate.trim() === "") {
    errors.push({ field: "birthDate", message: "Birth date is required" });
  } else {
    const birthDate = new Date(data.birthDate);
    const now = new Date();
    if (isNaN(birthDate.getTime())) {
      errors.push({ field: "birthDate", message: "Invalid date format" });
    } else if (birthDate > now) {
      errors.push({
        field: "birthDate",
        message: "Birth date cannot be in the future",
      });
    } else if (birthDate < new Date(now.getFullYear() - 10, 0, 1)) {
      errors.push({
        field: "birthDate",
        message: "Birth date seems too far in the past",
      });
    }
  }

  // Gender validation (required)
  if (!data.gender) {
    errors.push({ field: "gender", message: "Gender is required" });
  }

  // Photo URL validation (optional)
  if (data.photoUrl && data.photoUrl.trim() !== "") {
    try {
      new URL(data.photoUrl);
    } catch {
      errors.push({ field: "photoUrl", message: "Invalid photo URL" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get error message for a specific field
 */
export function getErrorMessage(
  validation: ValidationResult,
  field: string
): string | undefined {
  return validation.errors.find((error) => error.field === field)?.message;
}

/**
 * Check if a specific field has errors
 */
export function hasFieldError(
  validation: ValidationResult,
  field: string
): boolean {
  return validation.errors.some((error) => error.field === field);
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(validation: ValidationResult): string {
  if (validation.errors.length === 0) {
    return "Validation passed";
  }

  return validation.errors.map((error) => error.message).join("\n");
}
