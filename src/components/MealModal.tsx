import { useEffect, useMemo, useState } from "react";

import type { Recipe } from "../types/recipe";

import { addRecipe, findRecipeByName } from "../services/recipeService";

type MealModalProps = {
  isOpen: boolean;
  day: string;
  mealType: string;
  recipes: Recipe[];
  onClose: () => void;
  onSave: (mealName: string) => void;
};

function MealModal({
  isOpen,
  day,
  mealType,
  recipes,
  onClose,
  onSave,
}: MealModalProps) {
  const [mealName, setMealName] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMealName("");

      setIsSaving(false);
    }
  }, [isOpen]);

  const suggestions = useMemo(() => {
    const searchTerm = mealName.trim().toLowerCase();

    if (!searchTerm) {
      return [];
    }

    return recipes
      .filter((recipe) => !recipe.isArchived)
      .filter((recipe) => recipe.normalizedName.includes(searchTerm))
      .slice(0, 5);
  }, [mealName, recipes]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    const trimmedMeal = mealName.trim();

    if (!trimmedMeal) {
      return;
    }

    setIsSaving(true);

    try {
      const existingRecipe = findRecipeByName(recipes, trimmedMeal);

      let recipeName = trimmedMeal;

      if (existingRecipe) {
        recipeName = existingRecipe.name;
      } else {
        await addRecipe(trimmedMeal);
      }

      onSave(recipeName);

      onClose();
    } catch (error) {
      console.error(error);

      alert("Failed to save recipe.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setMealName(recipe.name);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Meal</h2>

        <p>
          <strong>{day}</strong> – {mealType}
        </p>

        <input
          type="text"
          placeholder="Search or create recipe"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          autoFocus
        />

        {suggestions.length > 0 && (
          <div
            style={{
              border: "1px solid #ccc",

              borderRadius: "4px",

              marginTop: "8px",

              maxHeight: "150px",

              overflowY: "auto",
            }}
          >
            {suggestions.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                style={{
                  display: "block",

                  width: "100%",

                  textAlign: "left",

                  padding: "8px",

                  border: "none",

                  background: "white",

                  cursor: "pointer",
                }}
                onClick={() => handleSelectRecipe(recipe)}
              >
                {recipe.name}
              </button>
            ))}
          </div>
        )}

        {mealName.trim() &&
          findRecipeByName(recipes, mealName) === undefined && (
            <p
              style={{
                marginTop: "8px",

                fontSize: "0.9rem",
              }}
            >
              New recipe will be created.
            </p>
          )}

        <div className="modal-buttons">
          <button onClick={onClose} disabled={isSaving}>
            Cancel
          </button>

          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MealModal;
