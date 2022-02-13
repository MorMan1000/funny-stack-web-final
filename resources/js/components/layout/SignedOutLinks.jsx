import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import M from 'materialize-css/dist/js/materialize.min.js';



//Returns the navbar links for signed out users/guests.
const SignedOutLinks = () => {
  const sideNav = useRef(null);
  useEffect(() => {
    const elems = document.querySelectorAll('.sidenav');
    sideNav.current = M.Sidenav.init(elems, {}
    )[0];
  }, [])
  return (
    <div>
      <ul className="right hide-on-med-and-down">
        <li><NavLink to="/meme">New Meme</NavLink></li>
        <li><NavLink to="/search">Search</NavLink></li>
        <li><NavLink to="/signup">SignUp</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
      </ul>
      <ul className="sidenav" id="mobile-links" onClick={() => {
        sideNav.current.close()
      }
      }
      >
        <li><NavLink to="/meme">New Meme</NavLink></li>
        <li><NavLink to="/search">Search</NavLink></li>
        <li><NavLink to="/signup">SignUp</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li> </ul>
    </div>
  )
}

export default SignedOutLinks;