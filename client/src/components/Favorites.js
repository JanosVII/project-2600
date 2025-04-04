import { useEffect, useState } from "react";
import FruitCard from "./FruitCard.js";
import "./Fruits.css";

const API_URL = "http://localhost:3000/api/v1";

const Favorites = (props) => {
  const { userID } = props;
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's favorites when component mounts or userID changes
  useEffect(() => {
    if (userID) {
      loadFavorites();
    }
  }, [userID]);

  // Fetches favorites from API with error handling
  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/users/${userID}/favorites`)
      .then((response) => {
        if (!response.ok) {
          // Extract error message from response body if available
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to fetch favorites");
          });
        }
        return response.json();
      })
      .then((result) => {
        setFavorites(result);
      })
      .catch((error) => {
        setError(
          error.message || "Failed to load favorites. Please try again later."
        );
        console.error("Error fetching favorites:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Removes fruit from favorites and updates UI with optimistic update
  const handleRemoveFavorite = async (fruitId) => {
    fetch(`${API_URL}/users/${userID}/favorites/${fruitId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          // Extract error message from response body if available
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to remove favorite");
          });
        }
        // Update state immediately to remove fruit from UI (optimistic update)
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fruit) => fruit._id !== fruitId)
        );
      })
      .catch((error) => {
        setError(
          error.message || "Failed to remove favorite. Please try again later."
        );
        console.error("Error removing favorite:", error);
      });
  };

  // If not logged in, prompt user to register
  if (!userID) {
    return (
      <div className="favorites">
        <h2>My favorite</h2>
        <div className="message">
          Please register to view and manage your favorite fruits
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading favorites...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="favorites">
      <h2>My Favorites</h2>
      <div className="user-info">
        User ID: <span className="highlight">{userID}</span>
      </div>
      {/* Show message if no favorites, otherwise display favorite fruits */}
      {favorites.length === 0 ? (
        <div className="message">
          You have not added any fruits to your favorites yet.
        </div>
      ) : (
        <div className="fruit-cards">
          {favorites.map((fruit) => (
            <FruitCard
              key={fruit._id}
              fruit={fruit}
              userID={userID}
              removeFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Favorites;
