import { useState } from "react";

type MealModalProps = {
  isOpen: boolean;
  day: string;
  mealType: string;
  onClose: () => void;
  onSave: (mealName: string) => void;
};

function MealModal({
  isOpen,
  day,
  mealType,
  onClose,
  onSave,
}: MealModalProps) {
  const [mealName, setMealName] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const trimmedMeal = mealName.trim();

    if (!trimmedMeal) {
      return;
    }

    onSave(trimmedMeal);

    setMealName("");

    onClose();
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
          placeholder="Enter meal name"
          value={mealName}
          onChange={(e) =>
            setMealName(e.target.value)
          }
          autoFocus
        />

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