type CalendarAppointmentType =
  | "pediatrician"
  | "checkup"
  | "vaccine"
  | "wellness"
  | "custom";

type CalendarMedicationType = "prescription" | "otc" | "supplement";

export type CalendarAppointment = {
  _id: string;
  title: string;
  type: CalendarAppointmentType;
  date: string;
  time: string;
  location?: string;
  isCompleted?: boolean;
};

export type CalendarMedication = {
  _id: string;
  name: string;
  type: CalendarMedicationType;
  dosage?: string;
  frequency?: string;
  isActive?: boolean;
};

export function normalizeAppointments(input: unknown): CalendarAppointment[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((raw) => normalizeAppointment(raw))
    .filter((a): a is CalendarAppointment => a !== null);
}

function normalizeAppointment(raw: any): CalendarAppointment | null {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw._id !== "string") return null;
  if (typeof raw.title !== "string") return null;
  if (typeof raw.type !== "string") return null;
  if (typeof raw.date !== "string") return null;
  if (typeof raw.time !== "string") return null;

  const type = raw.type as CalendarAppointmentType;
  if (
    type !== "pediatrician" &&
    type !== "checkup" &&
    type !== "vaccine" &&
    type !== "wellness" &&
    type !== "custom"
  ) {
    return null;
  }

  const location = typeof raw.location === "string" ? raw.location : undefined;
  const isCompleted =
    typeof raw.isCompleted === "boolean" ? raw.isCompleted : undefined;

  return {
    _id: raw._id,
    title: raw.title,
    type,
    date: raw.date,
    time: raw.time,
    location,
    isCompleted,
  };
}

export function normalizeMedications(input: unknown): CalendarMedication[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((raw) => normalizeMedication(raw))
    .filter((m): m is CalendarMedication => m !== null);
}

function normalizeMedication(raw: any): CalendarMedication | null {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw._id !== "string") return null;
  if (typeof raw.name !== "string") return null;
  if (typeof raw.type !== "string") return null;

  const type = raw.type as CalendarMedicationType;
  if (type !== "prescription" && type !== "otc" && type !== "supplement") {
    return null;
  }

  const dosage = typeof raw.dosage === "string" ? raw.dosage : undefined;
  const frequency =
    typeof raw.frequency === "string" ? raw.frequency : undefined;
  const isActive = typeof raw.isActive === "boolean" ? raw.isActive : undefined;

  return { _id: raw._id, name: raw.name, type, dosage, frequency, isActive };
}
