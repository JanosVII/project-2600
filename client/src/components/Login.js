import { useState, useEffect } from "react";
import "./Login.css";
const API_URL = "http://localhost:3000/api/v1";

// Component that handles user login through email-only authentication
const Login = (props) => {
  const { login } = props;
  const [formData, setFormData] = useState({
    email: "",
  });
  const [status, setStatus] = useState("unsubmitted");
  const [error, setError] = useState(null);

  // Updates form data state when user types in the email field
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handles form submission and sets status to pending for API call
  const submitForm = (event) => {
    event.preventDefault();
    setStatus("pending");
    setError(null);
  };

  // Executes API call to log in user when status changes to pending
  useEffect(() => {
    if (status === "pending") {
      fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Login failed");
            });
          }
          return response.json();
        })
        .then((result) => {
          console.log("Login response:", result);
          setStatus("success");
          // Call the login callback from parent with user information
          if (login) login(result.userID, result.username);
          setFormData({
            email: "",
          });
          setStatus("success");
        })
        .catch((error) => {
          setError(error.message || "Login failed. Please try again.");
          setStatus("fail");
        });
    }
  }, [status, formData, login]);
  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={submitForm} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ fontWeight: "bold", color: "navy" }}>
          Status: {status}
        </div>
        {/* Disable button during API calls and show processing state */}
        <button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Processing..." : "Login"}
        </button>
      </form>
      {/* Show error message when login fails */}
      {status === "fail" && error && (
        <div className="error-message">{error}</div>
      )}
      {/* Show success message when login succeeds */}
      {status === "success" && (
        <div className="success-message">
          Login Successfully! You can now view your favorites.
        </div>
      )}
    </div>
  );
};
export default Login;
