import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";

function LoginPage() {
  const { signin, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      signin(formData);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        {signinErrors.map((error, i) => (
          <div className="error-message" key={i}>
            {error}
          </div>
        ))}
        <h1>Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-input"
          />
          {formErrors.email && <p className="error-text">{formErrors.email}</p>}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-input"
          />
          {formErrors.password && (
            <p className="error-text">{formErrors.password}</p>
          )}

          <button type="submit" className="form-button">
            Login
          </button>
        </form>
      </div>
      {/* <p className="redirect-text">
        Don't have an account?{" "}
        <Link to="/register" className="redirect-link">
          sign up
        </Link>
      </p> */}
    </div>
  );
}

export default LoginPage;
