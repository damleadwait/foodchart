import type {
  MealPlan,
} from "../types/mealPlan";

import {
  mealTypes,
} from "../types/mealPlan";

import {
  ingredientAliases,
} from "../data/ingredientAliases";

import {
  recipeDatabase,
} from "../data/recipeDatabase";

const normalizeText = (
  value: string
): string => {
  return value
    .trim()
    .toLowerCase();
};

const normalizeIngredient = (
  ingredient: string
): string => {
  const normalized =
    normalizeText(ingredient);

  return (
    ingredientAliases[
      normalized
    ] ?? ingredient.trim()
  );
};

export const generateGroceryList =
  (
    mealPlan: MealPlan
  ): string[] => {
    const groceries =
      new Set<string>();

    Object.values(
      mealPlan
    ).forEach((dayPlan) => {
      mealTypes.forEach(
        (mealType) => {
          dayPlan[
            mealType
          ].forEach((dish) => {
            const normalizedDish =
              normalizeText(dish);

            const ingredients =
              recipeDatabase[
                normalizedDish
              ];

            if (
              ingredients &&
              ingredients.length > 0
            ) {
              ingredients.forEach(
                (
                  ingredient
                ) => {
                  groceries.add(
                    normalizeIngredient(
                      ingredient
                    )
                  );
                }
              );
            } else {
              groceries.add(
                normalizeIngredient(
                  dish
                )
              );
            }
          });
        }
      );
    });

    return Array.from(
      groceries
    ).sort();
  };