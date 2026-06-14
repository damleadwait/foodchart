import "./App.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function App() {
  return (
    <div className="container">
      <h1>FoodChart</h1>
      <p>Weekly Meal Planner</p>

      <table className="meal-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td>{day}</td>

              <td>
                <button>+ Add</button>
              </td>

              <td>
                <button>+ Add</button>
              </td>

              <td>
                <button>+ Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;