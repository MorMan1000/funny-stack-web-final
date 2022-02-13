import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"
import axios from 'axios'
import { getCookieValueByName, deleteCookie } from '../utils'

//The auth provider saves the authintication state, performs the auth actions by interacting with the server.

const AuthContext = React.createContext();
//Costum hook used to get this context data within other components.
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const history = useHistory();

  /**
   * Request the server to sign up a new user.
   * @param userInfo - an object with the user details.
   */
  const signup = async (userInfo) => {
    try {
      console.log("sign up request");
      const url = "/api/auth/signup";
      const userDetails = {
        user: { displayName: userInfo.displayName, userEmail: userInfo.userEmail, userPassword: userInfo.userPassword }, redirect: "http://localhost:8000/api/auth/verify-account/"
      };
      const options = {
        headers: { 'Content-type': 'application/json' }
      };
      setLoading(true);
      const response = await axios.post(url, userDetails, options);
      if (response) {
        const data = response.data;
        if (response.status >= 400)
          setErrors(data);
        else {
          history.push("/thanks")
        }
      }
    }

    catch (err) {
      setErrors(error.response.data);
    }
    finally {
      setLoading(false);
    }
  }


  /**
   * Request the server to sign in a user.
   * @param userCredentials - an object with the user email, and password or token id if google auth was used.
   */
  const login = async (userCredentials) => {
    try {
      const url = "/api/auth/signin";
      //Sending the user credentials to the server.
      const options = {
        headers: { 'Content-type': 'application/json' }
      };
      setLoading(true);
      const response = await axios.post(url, userCredentials, options)
      if (response) {
        const data = response.data;
        if (response.status >= 400)
          setErrors(data);
        else {
          setCurrentUser(JSON.parse(getCookieValueByName("user-details")));
        }
      }
      else {
        console.log("error");
      }
    }
    catch (error) {
      setErrors(error.response.data);
    }
    finally {
      setLoading(false);
    }
  }


  /**
   * Log out a user from the website and cleae their data from the    cookies
   */
  const logout = () => {
    console.log("logout");
    deleteCookie('user-details');
    setCurrentUser({});
    history.push("/");

  };

  /**
   * Sending request to backend to send email to reset the password
   * @param email - The email of the user's account
   */
  const resetPassword = async (email) => {
    setLoading(true);
    const response = await axios.post("/api/auth/reset-password", { userEmail: email, redirect: "/reset-password", redirect: "http://localhost:8000/reset-password" });
    setLoading(false);
    history.push("/password-reset-mail")
  };

  /**
   * Sending request to save a new password given by the user
   * @param userId - user id
   * @param password - the user's new password
   * @param hash  - A verification hash from the link that sent to the user's email
   */
  const updatePassword = async (userId, password, hash) => {
    try {
      setLoading(true);
      const response = await axios.put("/api/auth/update-password", { userId, password, hash });
      if (response.status === 200)
        setCurrentUser(response.data);
      else {
        setErrors(response.data);
      }
    }
    catch (err) {
      console.log(err.message);
      setErrors("Error occured while updating the password");
    }
    finally {
      setLoading(false);
    }
  };

  /**
   * Updating fields changed by the user
   * @param changes - object with changes given by the user
   */
  const updateAccount = async (changes) => {
    try {
      setLoading(true);
      const response = await axios.put("/api/auth/update-account/" + currentUser.userId, changes);
      if (response) {
        const user = response.data;
        if (user)
          setCurrentUser(user);
      }
    }
    catch (err) {
      let errData = err.response.data;
      if (errData instanceof Array)
        setErrors(err.response.data.join("\n"));
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = JSON.parse(getCookieValueByName('user-details')) || {};
    setCurrentUser(user);

  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    errors,
    setErrors,
    loading,
    updateAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
