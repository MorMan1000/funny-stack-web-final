import React from 'react'
import GoogleButton from 'react-google-button'
import { useGoogleLogin } from 'react-google-login'
import { useAuth } from '../../contexts/AuthContext'


//This components allows user to login with their google account.


const clientId = "1087793420672-c1kt2l67np3k2tmg34qjt424npro5np5.apps.googleusercontent.com";

const refreshTokenSetup = (res) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    console.log('newAuthRes:', newAuthRes);
    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem('authToken', newAuthRes.id_token);

    // Setup the other timer after the first one
    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};

//Google login component
const GoogleLogin = () => {
  const { login, setErrors } = useAuth();

  //When login succeeds
  const onSuccess = async (res) => {
    setErrors('');
    console.log('Login Success: currentUser:', res.profileObj);
    console.log("token id: ", res.tokenId);
    refreshTokenSetup(res);
    login({ email: res.profileObj.email, tokenId: res.tokenId });
  }
  //When login fails
  const onFailure = (res) => {
    console.log(res);
    setErrors('Login failed');
  };
  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: false,
    accessType: 'offline',
  });
  return <GoogleButton onClick={signIn} />
}

export default GoogleLogin
