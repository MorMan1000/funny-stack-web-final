import React from 'react'
import GoogleButton from 'react-google-button'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/AuthContext'


//This components allows user to login with their google account.

//Google login component
const GoogleLogin = () => {
  const { login, setErrors } = useAuth();


  const signIn = useGoogleLogin({
    onSuccess: tokenResponse => {
      setErrors('');
      console.log(tokenResponse)
      login({ email: '', access_token: tokenResponse.access_token });
    },
    onError: resp => {
      console.log(res);
      setErrors('Login failed');
    }
  });

  return <GoogleButton onClick={signIn}> Sign In with Google </GoogleButton>
}

export default GoogleLogin;
