import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useGoogleLogout } from 'react-google-login';

//This components provides the sign out link functionality, and sign out a user from the website.
const clientId = "1087793420672-c1kt2l67np3k2tmg34qjt424npro5np5.apps.googleusercontent.com";
const SignOut = () => {
  const onLogoutSuccess = (res) => {
    console.log('Logged out Success');
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };
  const { currentUser, logout } = useAuth();
  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  return (
    <a href="#" onClick={() => {
      if (currentUser.googleLogin)
        signOut();
      logout();
    }}>Log Out</a>
  )
}

export default SignOut
