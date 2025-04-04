import { useState } from "react";
import Home from "./components/Home.js";
import Fruits from "./components/Fruits.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import Favorites from "./components/Favorites.js";
import "./App.css";

const App = () => {
  // State for navigation and user authentication
  const [currentPage, setCurrentPage] = useState("home");
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState(null);

  // Sets user info and navigates to favorites page after successful login
  const handleLogin = (id, name) => {
    setUserID(id);
    setUsername(name);
    setCurrentPage("favorites");
  };

  // Clears user info and returns to home page on logout
  const handleLogout = () => {
    setUserID(null);
    setUsername(null);
    setCurrentPage("home");
  };

  // Renders the appropriate component based on current navigation state
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "fruits":
        return <Fruits userID={userID} />;
      case "register":
        return (
          <Register
            register={(userID, username) => {
              setUserID(userID);
              setUsername(username);
            }}
          />
        );
      case "login":
        return <Login login={handleLogin} />;
      case "favorites":
        return <Favorites userID={userID} />;
      default:
        return <Home />;
    }
  };
  return (
    <div className="App">
      <header>
        <h1>Fruity Favorites</h1>
        <nav>
          <ul>
            <li>
              <button onClick={() => setCurrentPage("home")}>Home</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("fruits")}>
                All Fruits
              </button>
            </li>
            {/* Show login/register buttons for logged out users, favorites/logout for logged in users */}
            {!userID ? (
              <>
                <li>
                  <button onClick={() => setCurrentPage("register")}>
                    Register
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage("login")}>Login</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={() => setCurrentPage("favorites")}>
                    My Favorites
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLogout()} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
          {/* Display welcome message with username when logged in */}
          {username && (
            <div className="username-display">
              Welcome, {username}{" "}
              <span className="user-id">(ID: {userID})</span>
            </div>
          )}
        </nav>
      </header>

      <main>{renderPage()}</main>

      <footer>&copy;Anh Hoang Le 2024 Fruity Favorites</footer>
    </div>
  );
};
export default App;
