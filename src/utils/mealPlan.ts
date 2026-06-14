import { days } from "../types/mealPlan";

import type { MealPlan } from "../types/mealPlan";

export const LOCAL_STORAGE_KEY =
  "foodchart-meal-plan";

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

export const loadMealPlan =
  (): MealPlan => {
    const savedMealPlan =
      localStorage.getItem(
        LOCAL_STORAGE_KEY
      );

    if (!savedMealPlan) {
      return createEmptyMealPlan();
    }

    try {
      return JSON.parse(savedMealPlan);
    } catch {
      return createEmptyMealPlan();
    }
  };