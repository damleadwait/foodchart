import { useEffect, useState } from "react";
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

import {
  loadMealPlan,
} from "./utils/mealPlan";

import { db } from "./firebase";

import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

function App() {
  const [mealPlan, setMealPlan] =
    useState<MealPlan>(loadMealPlan);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedDay, setSelectedDay] =
    useState("");

  const [selectedMealType, setSelectedMealType] =
    useState<MealType>("Breakfast");

  /*
   * Listen for realtime updates
   */
  useEffect(() => {
    const mealPlanRef = doc(
      db,
      "mealPlans",
      "currentWeek"
    );

    const unsubscribe = onSnapshot(
      mealPlanRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setMealPlan(
            snapshot.data() as MealPlan
          );
        }
      }
    );

    return unsubscribe;
  }, []);

  /*
   * Save changes to Firestore
   */
  useEffect(() => {
    const mealPlanRef = doc(
      db,
      "mealPlans",
      "currentWeek"
    );

    setDoc(mealPlanRef, mealPlan);
  }, [mealPlan]);

  const openModal = (
    day: string,
    mealType: MealType
  ) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
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

        [mealType]: prev[day][
          mealType
        ].filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="container">
      <h1>FoodChart</h1>

      <p>Weekly Meal Planner</p>

      <table className="meal-table">
        <thead>
          <tr>
            <th>Day</th>

            {mealTypes.map((meal) => (
              <th key={meal}>{meal}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="day-cell">
                {day}
              </td>

              {mealTypes.map(
                (mealType) => (
                  <td key={mealType}>
                    <div className="meal-cell">
                      {mealPlan[
                        day
                      ][mealType].map(
                        (
                          meal,
                          index
                        ) => (
                          <div
                            key={index}
                            className="meal-chip"
                          >
                            <span>
                              {meal}
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

      <MealModal
        isOpen={isModalOpen}
        day={selectedDay}
        mealType={selectedMealType}
        onClose={closeModal}
        onSave={handleSaveMeal}
      />
    </div>
  );
}

export default App;