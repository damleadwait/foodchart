import { days } from "../types/mealPlan";

import type {
  MealPlan,
} from "../types/mealPlan";

export const createEmptyMealPlan =
  (): MealPlan => {
    const plan: MealPlan = {};

    days.forEach((day) => {
      plan[day] = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        notes: "",
      };
    });

    return plan;
  };

export const normalizeMealPlan =
  (
    incoming: Partial<MealPlan>
  ): MealPlan => {
    const empty =
      createEmptyMealPlan();

    Object.entries(
      incoming ?? {}
    ).forEach(([day, value]) => {
      empty[day] = {
        Breakfast:
          value?.Breakfast ?? [],
        Lunch:
          value?.Lunch ?? [],
        Dinner:
          value?.Dinner ?? [],
        notes:
          value?.notes ?? "",
      };
    });

    return empty;
  };