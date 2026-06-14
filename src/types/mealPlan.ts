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

export type MealPlan = {
  [day: string]: {
    Breakfast: string[];
    Lunch: string[];
    Dinner: string[];
  };
};