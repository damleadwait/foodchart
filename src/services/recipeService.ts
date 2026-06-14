import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
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
        }));

      recipes.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      callback(recipes);
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
      createdAt:
        serverTimestamp(),
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