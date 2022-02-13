import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useWebContext } from '../../contexts/WebContext'
import SignedInLink from "./SignedInLinks";
import SignedOutLink from "./SignedOutLinks";

/**
 * This component is the wesite's navbar which is shown on every page in the website and allows users to navigate through all of the pages. The navbar links vary depending om whether the user is logged in with account or not
 */
const Navbar = () => {
  const location = useLocation();
  const { setIsEditing, resetMemeData } = useWebContext();
  const { currentUser, logout } = useAuth();
  const links = currentUser.hasOwnProperty("userId") ? <SignedInLink displayName={currentUser?.displayName} userId={currentUser.userId} logout={logout} /> : <SignedOutLink />
  useEffect(() => {
    console.log(location);
    const pattern = /^\/meme\/[0-9]+$/;
    if (!pattern.test(location.pathname)) {
      setIsEditing(true);
      resetMemeData();
    }
  }, [location])

  return (
    <div className="navbar-fixed">
      <nav className="nav-wrapper indigo">
        <a href="#" className="sidenav-trigger" data-target="mobile-links"> <i className="material-icons">menu</i> </a>
        <div className="container">
          <Link className="brand-logo" to="/">FunnyStack</Link>
          {
            links
          }
        </div>
      </nav>
    </div>
  )
}

export default Navbar;
