import React, { useState } from "react";
import "./Login.css";
import { auth } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function Login() {
  const [isLoginActive, setIsLoginActive] = useState(true);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      alert("Logged in successfully");
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Wrong email or password");
    }
  };

  // REGISTER
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      alert("Account created successfully");
      setIsLoginActive(true); // switch back to login tab
    } catch (error) {
      alert("There is something wrong, talk to NKO");
    }
  };

  return (
    <div className="parent">
      <div className="container">
        <div className="form-box">
          <div className="header">
            <h2>Rugby Athletes</h2>
            <p>Join the community</p>
          </div>

          <div className="tab-buttons">
            <button
              className={isLoginActive ? "active" : ""}
              onClick={() => setIsLoginActive(true)}
            >
              Login
            </button>
            <button
              className={!isLoginActive ? "active" : ""}
              onClick={() => setIsLoginActive(false)}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLoginActive && (
            <form className="form" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email *"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <div className="password-field">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password *"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button type="submit" className="submit-btn">
                Login
              </button>

              <p className="toggle-text">
                Don’t have an account?{" "}
                <span onClick={() => setIsLoginActive(false)}>Register here</span>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {!isLoginActive && (
            <form className="form" onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email *"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />

              <div className="password-field">
                <input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Password *"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                >
                  {showRegPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button type="submit" className="submit-btn">
                Register
              </button>

              <p className="toggle-text">
                Already have an account?{" "}
                <span onClick={() => setIsLoginActive(true)}>Login here</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
