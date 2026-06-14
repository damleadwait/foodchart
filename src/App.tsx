import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./App.css";

import MealModal from "./components/MealModal";

import {
  days,
  mealTypes,
} from "./types/mealPlan";

import type {
  MealPlan,
  MealType,
} from "./types/mealPlan";

import type { Recipe } from "./types/recipe";

import {
  createEmptyMealPlan,
  normalizeMealPlan,
} from "./utils/mealPlan";

import { generateGroceryList } from "./utils/groceryList";

import { db } from "./firebase";

import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import {
  archiveRecipe,
  subscribeToRecipes,
} from "./services/recipeService";

function App() {
  const [mealPlan, setMealPlan] =
    useState<MealPlan>(
      createEmptyMealPlan()
    );

  const [recipes, setRecipes] =
    useState<Recipe[]>([]);
  
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedDay, setSelectedDay] =
    useState("");

  const [selectedMealType, setSelectedMealType] =
    useState<MealType>("Breakfast");

  const hasLoadedFromFirestore =
    useRef(false);

  useEffect(() => {
    const mealPlanRef = doc(
      db,
      "mealPlans",
      "currentWeek"
    );

    const unsubscribe =
      onSnapshot(
        mealPlanRef,
        (snapshot) => {
          if (
            snapshot.exists()
          ) {
            setMealPlan(
              normalizeMealPlan(
                snapshot.data() as MealPlan
              )
            );
          } else {
            setDoc(
              mealPlanRef,
              createEmptyMealPlan()
            );
          }

          hasLoadedFromFirestore.current =
            true;
        }
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe =
      subscribeToRecipes(
        setRecipes
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (
      !hasLoadedFromFirestore.current
    ) {
      return;
    }

    const mealPlanRef = doc(
      db,
      "mealPlans",
      "currentWeek"
    );

    setDoc(
      mealPlanRef,
      mealPlan
    );
  }, [mealPlan]);

  const openModal = (
    day: string,
    mealType: MealType
  ) => {
    setSelectedDay(day);
    setSelectedMealType(
      mealType
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMeal = (
    mealName: string
  ) => {
    setMealPlan((prev) => ({
      ...prev,

      [selectedDay]: {
        ...prev[selectedDay],

        [selectedMealType]: [
          ...prev[selectedDay][
            selectedMealType
          ],
          mealName,
        ],
      },
    }));
  };

  const handleDeleteMeal = (
    day: string,
    mealType: MealType,
    index: number
  ) => {
    setMealPlan((prev) => ({
      ...prev,

      [day]: {
        ...prev[day],

        [mealType]: prev[
          day
        ][mealType].filter(
          (_, i) =>
            i !== index
        ),
      },
    }));
  };

  const handleEditNotes = (
    day: string
  ) => {
    const currentNotes =
      mealPlan[day]
        ?.notes ?? "";

    const updatedNotes =
      window.prompt(
        `Notes for ${day}\n\nExamples:\n16 Jun\n🎂 Dad's Birthday\n🚫 Anuja not available`,
        currentNotes
      );

    if (
      updatedNotes === null
    ) {
      return;
    }

    setMealPlan((prev) => ({
      ...prev,

      [day]: {
        ...prev[day],

        notes:
          updatedNotes,
      },
    }));
  };

  const handleArchiveRecipe =
  async (recipe: Recipe) => {
    const confirmed =
      window.confirm(
        `Archive "${recipe.name}"?\n\nArchived recipes will disappear from the Recipe Library and meal suggestions. Existing meal plans will remain unchanged.`
      );

    if (
      !confirmed ||
      !recipe.id
    ) {
      return;
    }

    try {
      await archiveRecipe(
        recipe.id
      );
    } catch (error) {
      console.error(
        "Failed to archive recipe:",
        error
      );

      window.alert(
        "Unable to archive recipe."
      );
    }
  };

  const visibleRecipes =
  recipes
    .filter(
      (recipe) =>
        !recipe.isArchived
    )
    .filter((recipe) =>
      recipe.name
        .toLowerCase()
        .includes(
          recipeSearchTerm.toLowerCase()
        )
    );

  const groceryList =
  generateGroceryList(
    mealPlan,
    recipes
  );

  return (
    <div className="container">
      <h1>FoodChart</h1>

      <p>
        Weekly Meal Planner
      </p>

      <table className="meal-table">
        <thead>
          <tr>
            <th>Day</th>

            {mealTypes.map(
              (meal) => (
                <th key={meal}>
                  {meal}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="day-cell">
                <div className="day-name">
                  {day}
                </div>

                {mealPlan[day]
                  ?.notes && (
                  <div className="day-notes">
                    {mealPlan[
                      day
                    ].notes
                      .split(
                        "\n"
                      )
                      .map(
                        (
                          line,
                          index
                        ) => (
                          <div
                            key={
                              index
                            }
                          >
                            {line}
                          </div>
                        )
                      )}
                  </div>
                )}

                <button
                  className="notes-button"
                  onClick={() =>
                    handleEditNotes(
                      day
                    )
                  }
                >
                  {mealPlan[
                    day
                  ]?.notes
                    ? "Edit Notes"
                    : "+ Notes"}
                </button>
              </td>

              {mealTypes.map(
                (
                  mealType
                ) => (
                  <td
                    key={
                      mealType
                    }
                  >
                    <div className="meal-cell">
                      {mealPlan[
                        day
                      ][
                        mealType
                      ].map(
                        (
                          meal,
                          index
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="meal-chip"
                          >
                            <span>
                              {
                                meal
                              }
                            </span>

                            <button
                              className="remove-button"
                              onClick={() =>
                                handleDeleteMeal(
                                  day,
                                  mealType,
                                  index
                                )
                              }
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}

                      <button
                        className="add-button"
                        onClick={() =>
                          openModal(
                            day,
                            mealType
                          )
                        }
                      >
                        + Add Meal
                      </button>
                    </div>
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grocery-section">
        <h2>
          🛒 Grocery List
        </h2>

        {groceryList.length ===
        0 ? (
          <p>
            Add meals to
            generate your
            grocery list.
          </p>
        ) : (
          <>
            <div className="grocery-grid">
              {groceryList.map(
                (
                  ingredient
                ) => (
                  <label
                    key={
                      ingredient
                    }
                    className="grocery-item"
                  >
                    <input
                      type="checkbox"
                    />

                    <span>
                      {
                        ingredient
                      }
                    </span>
                  </label>
                )
              )}
            </div>

            <p className="grocery-note">
              Grocery list is
              generated from
              this week's meal
              plan.
            </p>
          </>
        )}
      </div>
      
      <div className="recipe-library">
  <h2>
    📚 Recipe Library
  </h2>

  <input
    type="text"
    placeholder="Search recipes..."
    value={recipeSearchTerm}
    onChange={(event) =>
      setRecipeSearchTerm(
        event.target.value
      )
    }
    className="recipe-search"
  />

  {visibleRecipes.length ===
  0 ? (
    <p>
      No recipes found.
    </p>
  ) : (
    <div className="recipe-list">
      {visibleRecipes.map(
        (recipe) => (
          <div
            key={recipe.id}
            className="recipe-item"
          >
            <span>
              {recipe.name}
            </span>

            <button
              className="archive-button"
              onClick={() =>
                handleArchiveRecipe(
                  recipe
                )
              }
            >
              Archive
            </button>
          </div>
        )
      )}
    </div>
  )}
</div>

      <MealModal
          isOpen={isModalOpen}
          day={selectedDay}
          mealType={selectedMealType}
          recipes={recipes.filter(
              (recipe) =>
              !recipe.isArchived
          )}
          onClose={closeModal}
          onSave={handleSaveMeal}
/>
    </div>
  );
}

export default App;