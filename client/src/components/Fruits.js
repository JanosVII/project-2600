import { useState, useEffect } from "react";
import FruitCard from "./FruitCard.js";
import "./Fruits.css";
const API_URL = "/api/v1";
const Fruits = (props) => {
  const [fruits, setFruits] = useState([]);
  const [filteredFruits, setFilteredFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Search and calorie range filtering state
  const [filters, setFilters] = useState({
    search: "",
    minCalories: "",
    maxCalories: "",
  });

  // Fetches fruits from API whenever filter criteria change
  useEffect(() => {
    // Build query parameters based on active filters
    const params = new URLSearchParams();
    if (filters.minCalories) {
      params.append("minCalories", filters.minCalories);
    }
    if (filters.maxCalories) {
      params.append("maxCalories", filters.maxCalories);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    fetch(`${API_URL}/fruits?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          // Extract error message from response body if available
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to fetch fruits");
          });
        }
        return response.json();
      })
      .then((result) => {
        setFruits(result);
        setFilteredFruits(result);
      })
      .catch((error) => {
        setError(error.message || "Failed to fetch fruits");
        console.error("Error fetching fruits:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  // Updates filter state while preserving other filter values
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="loading">Loading Fruits...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <div className="fruits">
      <h2>All Fruits</h2>
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search fruits..."
          />
        </div>
        <div className="filter-group">
          <input
            type="number"
            name="minCalories"
            value={filters.minCalories}
            onChange={handleFilterChange}
            placeholder="Min Calories"
          />
          <input
            type="number"
            name="maxCalories"
            value={filters.maxCalories}
            onChange={handleFilterChange}
            placeholder="Max Calories"
          />
        </div>
        <div className="fruit-cards">
          {/* Render a card for each fruit in the filtered results */}
          {filteredFruits.map((fruit) => (
            <FruitCard key={fruit._id} fruit={fruit} userID={props.userID} />
          ))}
        </div>
        {/* Show message when no fruits match the filter criteria */}
        {filteredFruits.length === 0 && (
          <div className="no-results">
            No fruits found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Fruits;
