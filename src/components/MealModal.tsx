import { useEffect, useMemo, useState } from "react";

import type { Recipe } from "../types/recipe";

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

  useEffect(() => {
    if (isOpen) {
      setMealName("");
    }
  }, [isOpen]);

  const suggestions = useMemo(() => {
    const searchTerm = mealName
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      return [];
    }

    return recipes
      .filter((recipe) =>
        recipe.normalizedName.includes(searchTerm)
      )
      .slice(0, 5);
  }, [mealName, recipes]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const trimmedMeal = mealName.trim();

    if (!trimmedMeal) {
      return;
    }

    const matchingRecipe = recipes.find(
      (recipe) =>
        recipe.normalizedName ===
        trimmedMeal.toLowerCase()
    );

    if (!matchingRecipe) {
      alert(
        "Please select an existing recipe. Creating new recipes will be available in the next milestone."
      );

      return;
    }

    onSave(matchingRecipe.name);

    onClose();
  };

  const handleSelectRecipe = (
    recipe: Recipe
  ) => {
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
          placeholder="Search recipes"
          value={mealName}
          onChange={(e) =>
            setMealName(e.target.value)
          }
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
                onClick={() =>
                  handleSelectRecipe(recipe)
                }
              >
                {recipe.name}
              </button>
            ))}
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={onClose}>
            Cancel
          </button>

          <button onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default MealModal;