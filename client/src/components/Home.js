import { useState, useEffect } from "react";
import FruitCard from "./FruitCard.js";
import "./Home.css";

const API_URL = "/api/v1";
const Home = () => {
  const [featuredFruits, setFeaturedFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`${API_URL}/fruits`)
      .then((response) => response.json())
      .then((result) => {
        const shuffledFruits = [...result].sort(() => Math.random() - 0.5);
        setFeaturedFruits(shuffledFruits.slice(0, 4));
      })
      .catch((error) => {
        setError("Failed to fetch featured fruits. Please try again later.");
        console.error("Error fetching fruits:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div className="loading">Loading Featured Fruits...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <div className="home">
      <h2>Welcome to Fruity Favorites!</h2>
      <p>
        Discover information about 50 different fruits and save your favorites
      </p>
      <section className="featured-fruits">
        <h3>Featured Fruits</h3>
        <div className="fruit-cards">
          {featuredFruits.map((fruit) => (
            <FruitCard key={fruit._id} fruit={fruit} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;
