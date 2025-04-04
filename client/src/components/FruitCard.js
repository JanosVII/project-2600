import { useState } from "react";
import "./FruitCard.css";
const API_URL = "/api/v1";
const FruitCard = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { fruit, addFavorite, removeFavorite, userID } = props;

  // Handles API request to add fruit to user favorites with error handling
  const handleAddFavorite = async () => {
    if (!userID) {
      setError("Please log in to add favorites");
      setSuccessMessage(null);
      return;
    }

    fetch(`${API_URL}/users/${userID}/favorites/${fruit._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to add to favorites");
          });
        }
        if (addFavorite) {
          addFavorite(fruit._id);
        }
        setError(null);
        setSuccessMessage("Added to favorites successfully!");

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      })
      .catch((error) => {
        setError(error.message || "Failed to add to favorites");
        setSuccessMessage(null);
      });
  };

  // Calls parent component's removeFavorite function and shows temporary success message
  const handleRemoveFavorite = () => {
    if (removeFavorite) {
      removeFavorite(fruit._id);
      setSuccessMessage("Removed from favorites");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  // Returns CSS class based on calorie level for visual indication
  const getCaloriesColor = (calories) => {
    return Number(calories) > 50 ? "high-calories" : "low-calories";
  };

  return (
    <div className="fruit-card">
      <h3>{fruit.name}</h3>
      <div className="fruit-card-body">
        <p>
          <strong>Name:</strong> {fruit.name}
        </p>
        <p>
          <strong>Taste:</strong> {fruit.taste}
        </p>
        <p>
          <strong>Calories:</strong>
          <span className={getCaloriesColor(fruit.calories)}>
            {fruit.calories}
          </span>
        </p>
      </div>
      <div className="fruit-card-actions">
        <div className="buttons-row">
          <button
            className="view-details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>

          {/* Conditionally render add or remove button based on context */}
          {removeFavorite ? (
            <button
              className="remove-favorite-btn"
              onClick={handleRemoveFavorite}
            >
              Remove from Favorites
            </button>
          ) : (
            <button className="add-favorite-btn" onClick={handleAddFavorite}>
              Add to Favorites
            </button>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {/* Conditionally render detailed fruit information when expanded */}
        {showDetails && (
          <div className="fruit-details">
            <p>
              <strong>Description:</strong> {fruit.description}
            </p>
            <h3>Macros</h3>
            <p>
              <strong>Carbs:</strong> {fruit.macros.carbs}g
            </p>
            <p>
              <strong>Protein:</strong> {fruit.macros.protein}g
            </p>
            <p>
              <strong>Fat:</strong> {fruit.macros.fat}g
            </p>
            <p>
              <strong>Fiber:</strong> {fruit.macros.fiber}g
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FruitCard;
