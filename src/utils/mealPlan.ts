import { days } from "../types/mealPlan";

import type { MealPlan } from "../types/mealPlan";

export const createEmptyMealPlan =
  (): MealPlan => {
    const plan: MealPlan = {};

    days.forEach((day) => {
      plan[day] = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
      };
    });

    return plan;
  };