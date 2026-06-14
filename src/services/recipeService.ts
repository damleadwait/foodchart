import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import type { Recipe } from "../types/recipe";

const recipesCollection = collection(
  db,
  "recipes"
);

export function subscribeToRecipes(
  callback: (
    recipes: Recipe[]
  ) => void
) {
  const recipesQuery =
    query(recipesCollection);

  return onSnapshot(
    recipesQuery,
    (snapshot) => {
      const recipes: Recipe[] =
        snapshot.docs.map((doc) => ({
          id: doc.id,

          name: doc.data().name,

          normalizedName:
            doc.data()
              .normalizedName,

          isArchived:
            doc.data()
              .isArchived ??
            false,
        }));

      recipes.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      callback(recipes);
    },
    (error) => {
      console.error(
        "Recipe subscription failed:",
        error
      );
    }
  );
}

export async function addRecipe(
  name: string
) {
  const normalizedName =
    name.trim().toLowerCase();

  return addDoc(
    recipesCollection,
    {
      name: name.trim(),

      normalizedName,

      isArchived: false,

      createdAt:
        serverTimestamp(),
    }
  );
}

export async function archiveRecipe(
  recipeId: string
) {
  const recipeRef = doc(
    db,
    "recipes",
    recipeId
  );

  await updateDoc(
    recipeRef,
    {
      isArchived: true,
    }
  );
}

export function findRecipeByName(
  recipes: Recipe[],
  name: string
) {
  const normalizedName =
    name.trim().toLowerCase();

  return recipes.find(
    (recipe) =>
      recipe.normalizedName ===
      normalizedName
  );
}