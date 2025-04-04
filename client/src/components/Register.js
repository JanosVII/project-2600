import { useState, useEffect } from "react";
import "./Register.css";

const API_URL = "http://localhost:3000/api/v1";

// Component that handles new user registration with username and email
const Register = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const { register } = props;
  const [status, setStatus] = useState("unsubmitted");
  const [error, setError] = useState(null);

  // Updates form data state when user inputs change
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

  // Executes API call to register user when status changes to pending
  useEffect(() => {
    if (status === "pending") {
      fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Registration failed");
            });
          }
          return response.json();
        })
        .then((result) => {
          console.log("Registration response:", result);
          // Call the register callback from parent with user information
          if (register) register(result.userID, result.username);
          setFormData({
            username: "",
            email: "",
          });
          setStatus("success");
        })
        .catch((error) => {
          setError(error.message || "Registration failed. Please try again.");
          setStatus("fail");
        });
    }
  }, [status, formData, register]);
  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={submitForm} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
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
          {status === "pending" ? "Processing..." : "Register"}
        </button>
      </form>
      {/* Show error message when registration fails */}
      {status === "fail" && error && <div className="error">{error}</div>}
      {/* Show success message when registration succeeds */}
      {status === "success" && (
        <div className="success">
          Registration successful! You can now add fruits to your favorites
        </div>
      )}
    </div>
  );
};
export default Register;
