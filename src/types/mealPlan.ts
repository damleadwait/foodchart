export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const mealTypes = [
  "Breakfast",
  "Lunch",
  "Dinner",
] as const;

export type MealType =
  (typeof mealTypes)[number];

export type DayPlan = {
  Breakfast: string[];
  Lunch: string[];
  Dinner: string[];
  notes: string;
};

export type MealPlan = {
  [day: string]: DayPlan;
};