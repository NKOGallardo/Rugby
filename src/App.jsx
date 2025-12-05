import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App;
