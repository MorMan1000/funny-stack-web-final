import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';
import SignOut from '../auth/SignOut';

//Returns the navbar links for signed in users.
const SignedInLinks = ({ displayName, userId }) => {
  const sideNav = useRef(null);
  useEffect(() => {
    let elems = document.querySelectorAll('.dropdown-trigger');

    M.Dropdown.init(elems, {
      hover: true
    }

    );
    elems = document.querySelectorAll('.sidenav');

    sideNav.current = M.Sidenav.init(elems, {}

    )[0];
    elems = document.querySelectorAll('.dropdown-trigger');

    M.Dropdown.init(elems, {});
  }

    , []);

  return (
    <div>
      <ul id="dropdown1" className="dropdown-content">
        <li><NavLink to={"/user-memes/" + userId}>My memes</NavLink></li>
        <li><a href="/user-followings">My following</a></li>
        <li><NavLink to="/user-upvotes">My Upvotes</NavLink></li>
        <li className="divider"></li>
        <li><a href="/user-details">Profile</a></li>
      </ul>
      <ul className="right hide-on-med-and-down">
        <li><NavLink to="/meme">New Meme</NavLink></li>
        <li><NavLink to="/search">Search</NavLink></li>

        <li><SignOut /></li>
        <li><NavLink data-target="dropdown1" className="btn btn-floating pink lighten-1 dropdown-trigger" to="/"> {
          displayName.split(" ").map((word) => word[0])
        }

        </NavLink></li> </ul>
      <ul className="sidenav" id="mobile-links" onClick={() => {
        sideNav.current.close()
      }
      }
      > <h3> {
        displayName
      }

        </h3> <li><a href="">Home</a></li> <li><NavLink to="/meme">New Meme</NavLink></li> <li><NavLink to="/memes-list">My memes</NavLink></li> <li><SignOut /></li> </ul> </div>)
}

export default SignedInLinks;