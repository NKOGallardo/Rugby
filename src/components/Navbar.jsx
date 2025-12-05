import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left side: logo/title */}
      <div className="logo">RugbyGym</div>

      {/* Right side: links */}
      <div className="nav-links">
        <Link className="link" to="/dashboard">Dashboard</Link>
        <Link className="link" to="/workout">Workout</Link>
        <Link className="link" to="/progress">Progress</Link>
        <Link className="link" to="/leaderboard">Leaderboard</Link>
        <Link className="link" to="/profile">Profile</Link>
        <Link className="link" to="/Login">Login</Link>
        <a className="link" href="https://nkogallardo.link">Developer</a>
      </div>
    </nav>
  );
}

export default Navbar;
