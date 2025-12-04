import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left side: logo/title */}
      <div className="logo">RugbyGym</div>

      {/* Right side: links */}
      <div className="nav-links">
        <a className="link">Dashboard</a>
        <a className="link">Workout</a>
        <a className="link">Progress</a>
        <a className="link">Leaderboard</a>
        <a className="link" href="https://nkogallardo.link">Developer</a>
      </div>
    </nav>
  );
}

export default Navbar;
