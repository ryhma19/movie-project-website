import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userId"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("displayName");
    setIsLoggedIn(false);
    navigate("/home");
  };

  if (isLoggedIn) {
    return (
      <button type="button" className="user" onClick={handleLogout}>
        Log out
      </button>
    );
  }

  return (
    <>
      <Link to="/login">
        <button className="user">Sign in</button>
      </Link>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </>
  );
}
