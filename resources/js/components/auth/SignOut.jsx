import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { googleLogout } from '@react-oauth/google';

//This components provides the sign out link functionality, and sign out a user from the website.
const SignOut = () => {
  const onLogoutSuccess = (res) => {
    console.log('Logged out Success');
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };
  const { currentUser, logout } = useAuth();
  const signOut = googleLogout;

  return (
    <a href="#" onClick={() => {
      if (currentUser.googleLogin)
        signOut();
      logout();
    }}>Log Out</a>
  )
}

export default SignOut
