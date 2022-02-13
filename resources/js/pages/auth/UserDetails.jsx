import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import { Redirect } from 'react-router-dom';

/**
 In this page, users can see their account details, and update any of them
 */
const UserDetails = () => {
  const { currentUser, errors, loading, updateAccount, setErrors } = useAuth();
  const [userDetails, setUserDetails] = useState({ userEmail: '', displayName: '', userPassword: '', confirmPassword: '' }); //This object keep tracks on changes made by the user in any of the fields
  const pattern = {
    displayName: /^[\w]{2,15}([\s][\w]{1,15})?$/,
    userPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\w!?@#$%^*()<>,;`~]{8,}$/,
    userEmail: /^[\.-a-z\d]+@[a-z\d]+\.[a-z]{2,8}(\.[a-z]{2,8}){0,2}$/i
  };
  const btnRef = useRef(null);
  const updateMsg = useRef(null);

  /**
   * After submit, the function checks for each field if it changed, and if the change is valid. If all changes valid, a request to save the changes sent to the backend, otherwise corresponds errors messages would be displayed
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    updateMsg.current.className = "";
    let currErrors = "";
    console.log(userDetails);
    const changes = {};
    if (userDetails.displayName !== currentUser.displayName)
      if (!pattern.displayName.test(userDetails.displayName)) {
        currErrors += "Display name is not valid, make sure it has 1-2 words with "
      }
      else {
        changes["displayName"] = userDetails.displayName;
      }
    if (userDetails.userEmail !== currentUser.userEmail)
      if (!pattern.userEmail.test(userDetails.userEmail)) {
        if (currErrors)
          currErrors += "\n"
        currErrors += "Email is not valid, make sure it is in a valid format, e.g. me@mydomain.com";
      }
      else {
        changes["userEmail"] = userDetails.userEmail;
      }
    if (userDetails.userPassword.length > 0) {
      if (!pattern.userPassword.test(userDetails.userPassword)) {
        if (currErrors)
          currErrors += "\n"
        currErrors += "Password is not valid, make sure it has 8 - 20 characters with at least one uppercase letter, one lowercase letter and one digit";

      }
      else if (userDetails.userPassword !== userDetails.confirmPassword) {
        if (currErrors)
          currErrors += "\n"
        currErrors += "Passwords not matched";
      }
      else {
        changes["userPassword"] = userDetails.userPassword;
      }
    }
    updateMsg.current.className = "hide";
    if (currErrors)
      setErrors(currErrors)
    else {
      setErrors("");
      btnRef.current.disabled = true;
      updateAccount(changes).then(() => {
        if (!errors) {
          updateMsg.current.className = "";
        }
      }).finally(() => {
        btnRef.current.disabled = false;
      });
    }
  }
  const onChange = (name, val) => {
    setUserDetails({ ...userDetails, [name]: val })
  }
  useEffect(() => {
    if (currentUser.hasOwnProperty("userId")) {
      setUserDetails({ ...currentUser, userPassword: '', confirmPassword: '' });
      setErrors("");
    }
  }, [currentUser])
  return (
    !document.cookie.includes("user-details") ? <Redirect to="/" /> : <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input onChange={(e) => onChange("userEmail", e.target.value)} id="email" type="email" value={userDetails.userEmail} />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-field">
          <input onChange={(e) => onChange("displayName", e.target.value)} id="displayName" type="text" value={userDetails.displayName} />
          <label htmlFor="displayName">Display Name</label>
        </div>
        <div className="input-field">
          <input onChange={(e) => onChange("userPassword", e.target.value)} id="password" type="password" />
          <label htmlFor="password">Password</label>
        </div>
        <div className="input-field">
          <input onChange={(e) => onChange("confirmPassword", e.target.value)} id="confirmPassword" type="password" />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>
        <div className="left-align">
          <button ref={btnRef} type="submit" className="btn">Save</button>
        </div>
      </form>
      <ul className='errors red-text'>
        {errors && errors.split('\n').filter(val => val && val.trim() !== '').map((error, index) =>
          <li key={index}>{error}</li>
        )}
      </ul>
      <p className='hide' ref={updateMsg}>Details have been updated</p>
      {loading && <Loading />}
    </div>
  )
}

export default UserDetails
