import React, { useState } from "react";
import "./Login.css";

function Login() {
  // 1. Use React's useState to manage which form is active
  const [isLoginActive, setIsLoginActive] = useState(true);

  // 2. Event handlers to switch the form view
  const switchToLogin = () => setIsLoginActive(true);
  const switchToRegister = () => setIsLoginActive(false);

  // 3. Handlers for form submission (preventing default is essential in React too)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert("Logged in successfully");
    // In a real app, you would handle authentication here (e.g., fetch, axios)
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert("Account created successfully");
    // In a real app, you would handle user creation here (e.g., fetch, axios)
  };

  return (
    <div className="parent">
    <div className="container">
      <div className="form-box">
        <div className="header">
          {/* 4. Fix: Use 'className' instead of 'class' for all CSS classes in JSX */}
          <div className="logo">
            {/* Fix: Self-closing tags must end with '/>' and remove redundant closing tag */}
            <img src="/images/exercise-computer-icons-clip-art-icon-fitness-8c8d87bc80357ee48e4c9519bf963b36.png" alt="Trophy" width="50" />
          </div>
          <h2>Rugby Athletes</h2>
          <p>Join the community</p>
        </div>

        <div className="tab-buttons">
          {/* 5. Logic for switching tabs uses the state handler onClick */}
          <button
            id="login-btn"
            className={isLoginActive ? "active" : ""}
            onClick={switchToLogin}
          >
            Login
          </button>
          <button
            id="register-btn"
            className={!isLoginActive ? "active" : ""}
            onClick={switchToRegister}
          >
            Register
          </button>
        </div>

        {/* 6. Form conditional rendering and submission handling */}
        <form
          id="login-form"
          className={`form ${isLoginActive ? "" : "hidden"}`}
          onSubmit={handleLoginSubmit}
        >
          {/* Fix: <input> tags are self-closing in JSX */}
          <input type="email" id="login-email" placeholder="Email *" required />
          <input type="password" id="login-password" placeholder="Password *" required />
          <button type="submit" className="submit-btn">Login</button>
          <p className="toggle-text">
            Don't have an account?{" "}
            <span id="show-register" onClick={switchToRegister}>
              Register here
            </span>
          </p>
        </form>

        <form
          id="register-form"
          className={`form ${!isLoginActive ? "" : "hidden"}`}
          onSubmit={handleRegisterSubmit}
        >
          {/* Fix: <input> tags are self-closing in JSX */}
          <input type="text" id="register-name" placeholder="Full Name *" required />
          <input type="email" id="register-email" placeholder="Email *" required />
          <input type="password" id="register-password" placeholder="Password *" required />
          <button type="submit" className="submit-btn">Register</button>
          <p className="toggle-text">
            Already have an account?{" "}
            <span id="show-login" onClick={switchToLogin}>
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;