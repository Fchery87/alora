import { Id, TableNames } from "./_generated/dataModel";

export type IdValue<T extends TableNames> = Id<T>;

export type Feed = {
  _id: Id<"feeds">;
  _creationTime: number;
  babyId: Id<"babies">;
  type: "breast" | "formula" | "solid";
  side?: "left" | "right" | "both";
  amount?: string;
  duration?: number;
  startTime: number;
  endTime?: number;
  notes?: string;
  createdById: Id<"users">;
};

export type Diaper = {
  _id: Id<"diapers">;
  _creationTime: number;
  babyId: Id<"babies">;
  type: "wet" | "solid" | "both" | "mixed";
  color?: "yellow" | "orange" | "green" | "brown" | "red";
  notes?: string;
  startTime: number;
  endTime?: number;
  createdById: Id<"users">;
};

export type Sleep = {
  _id: Id<"sleep">;
  _creationTime: number;
  babyId: Id<"babies">;
  type: "nap" | "night" | "day";
  startTime: number;
  endTime?: number;
  duration?: number;
  quality: "awake" | "drowsy" | "sleeping" | "deep" | "awake";
  notes?: string;
  createdById: Id<"users">;
};

export interface CreateFeedInput {
  babyId: string;
  type: "breast" | "formula" | "solid";
  side?: "left" | "right" | "both";
  amount?: string;
  duration?: number;
  startTime: number;
  endTime?: number;
  notes?: string;
}

export interface CreateDiaperInput {
  babyId: string;
  type: "wet" | "solid" | "both" | "mixed";
  color?: "yellow" | "orange" | "green" | "brown" | "red";
  notes?: string;
  startTime: number;
  endTime?: number;
}

export interface CreateSleepInput {
  babyId: string;
  type: "nap" | "night" | "day";
  startTime: number;
  endTime?: number;
  duration?: number;
  quality: "awake" | "drowsy" | "sleeping" | "deep" | "awake";
  notes?: string;
}
