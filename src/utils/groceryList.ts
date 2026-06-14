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
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const normalizeIngredient = (
  ingredient: string
): string | null => {
  const normalized =
    normalizeText(ingredient);

  if (!normalized) {
    return null;
  }

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

            if (
              !normalizedDish
            ) {
              return;
            }

            const ingredients =
              recipeDatabase[
                normalizedDish
              ];

            /*
             * Recipe match found
             */
            if (
              ingredients &&
              ingredients.length > 0
            ) {
              ingredients.forEach(
                (
                  ingredient
                ) => {
                  const normalizedIngredient =
                    normalizeIngredient(
                      ingredient
                    );

                  if (
                    normalizedIngredient
                  ) {
                    groceries.add(
                      normalizedIngredient
                    );
                  }
                }
              );

              return;
            }

            /*
             * Support comma-separated ingredients
             */
            const directIngredients =
              dish.split(",");

            directIngredients.forEach(
              (
                ingredient
              ) => {
                const normalizedIngredient =
                  normalizeIngredient(
                    ingredient
                  );

                if (
                  normalizedIngredient
                ) {
                  groceries.add(
                    normalizedIngredient
                  );
                }
              }
            );
          });
        }
      );
    });

    return Array.from(
      groceries
    ).sort(
      (
        a,
        b
      ) =>
        a.localeCompare(b)
    );
  };