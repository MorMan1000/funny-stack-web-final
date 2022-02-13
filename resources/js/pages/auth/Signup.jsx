import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import M from 'materialize-css/dist/js/materialize.min.js'
import { Redirect } from 'react-router';
import Loading from '../../components/Loading'


//validation rules for sign up fields
const pattern = {
  displayName: /^[\w]{2,15}([\s][\w]{1,15})?$/,
  userPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\w!?@#$%^*()<>,;`~]{8,}$/,
  userEmail: /^[\.-a-z\d]+@[a-z\d]+\.[a-z]{2,8}(\.[a-z]{2,8}){0,2}$/i
};

//Signup component
const Signup = () => {
  const [userInfo, setUserInfo] = useState({ displayName: "", userEmail: "", userPassword: "", confirmPassword: "" });
  const signUpBtnReff = useRef(null);
  const { signup, errors, setErrors, currentUser, loading } = useAuth();
  const [fieldsValid, setFieldsValid] = useState({
    displayName: false, userEmail:
      false, userPassword: false, confirmPassword: false
  });
  const [fieldsClass, setFieldClass] = useState({ displayName: "", userEmail: "", userPassword: "", confirmPassword: "" })

  //Check if the input the user entering is valid.
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    if (e.target.name !== "confirmPassword") {
      let className = "";
      validate(e.target.name, e.target.value) ? className = "valid" : className = "invalid";
      setFieldClass({ ...fieldsClass, [e.target.name]: className });
    }
  }

  /**
   * Check if the input of the user is valid.
   * @param  inputName - The name of the input field to validate
   * @param  value  - The value of the input field to validate 
   * @returns true if input is valid, otherwise false.
   */
  const validate = (inputName, value) => {
    const regex = pattern[inputName];
    const regexResult = regex.test(value);
    setFieldsValid({ ...fieldsValid, [inputName]: regexResult });
    return regexResult;
  }

  /**
   * Checking if both passwords are identical.
   */
  const passwordsMatch = () => {
    const { userPassword, confirmPassword } = userInfo;
    if (userPassword || confirmPassword) {
      const arePasswordsMatch = userPassword === confirmPassword;
      setFieldsValid({ ...fieldsValid, ["confirmPassword"]: arePasswordsMatch });
      const className = fieldsValid.userPassword && arePasswordsMatch ? "valid" : "invalid";
      setFieldClass({ ...fieldsClass, ["confirmPassword"]: className });

    }
  }

  //Checked if all the fields are filled and valid. if so, The user can submit the form.
  const allValid = Object.values(fieldsValid).reduce((prevVals, currVal) => {
    return prevVals && currVal
  });

  //Called when the form is submitted. The user input is sent to the server.
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors('');
    signUpBtnReff.current.disabled = true;
    signup(userInfo);
  }
  useEffect(() => {
    if (currentUser) {
      if (userInfo.confirmPassword)
        passwordsMatch();
    }
  }, [userInfo.userPassword, userInfo.confirmPassword]);
  useEffect(() => {
    let elems = document.querySelectorAll('.tooltipped');
    let instances = M.Tooltip.init(elems, {}); //initialize tooltipis with information about each field.
    setErrors('');

  }, []);

  useEffect(() => {
    //Check for user input errors returned from the server, and update the form if there are errors.
    if (errors) {
      const errorTest = errors.toLowerCase();
      const fieldsClassCopy = { ...fieldsClass };
      const fieldsValidCopy = { ...fieldsClass };
      if (errorTest.includes("email")) {
        fieldsClassCopy["userEmail"] = "invalid";
        fieldsValidCopy["userEmail"] = false;
      }
      if (errorTest.includes("display name")) {
        fieldsClassCopy["displayName"] = "invalid";
        fieldsValidCopy["displayName"] = false;
      }
      if (errorTest.includes("password")) {
        fieldsClassCopy["userPassword"] = "invalid";
        fieldsValidCopy["userPassword"] = false;

      }
      setFieldClass(fieldsClassCopy);
      setFieldsValid(fieldsValidCopy);
    }
  }, [errors]);
  return (
    currentUser && Object.keys(currentUser).length > 0 ? <Redirect to="/" /> : <div className="container">
      <h2>New User Sign Up</h2>
      {
        loading && <Loading />
      }
      <form onSubmit={handleSubmit}>

        <div className="row">
          <div className="col s10 input-field">
            <input className={fieldsClass.displayName} onChange={handleChange} value={userInfo.displayName} type="text" name="displayName" />
            <label>Display Name </label>
          </div>
          <div className="col s2 info-tooltip">
            <i className="tooltipped material-icons" data-position="top" data-tooltip="Display name must be at least one word of 2 characters (letters or digits). Not more than 15 characters per word ">info</i>
          </div>
        </div>

        <div className="row">
          <div className="col s10 input-field">
            <input className={fieldsClass.userEmail} onChange={handleChange} value={userInfo.userEmail} type="text" name="userEmail" />
            <label>Email </label>
          </div>

          <div className="col s2 info-tooltip">
            <i className="tooltipped material-icons" data-position="top" data-tooltip="Email must be a valid address, e.g. me@mydomain.com">info</i>
          </div>
        </div>
        <div className="row">
          <div className="col s10 input-field">
            <input className={fieldsClass.userPassword} onChange={handleChange} value={userInfo.password} type="password" name="userPassword" />
            <label>Password </label>
          </div>
          <div className="col s2 info-tooltip">
            <i className="material-icons tooltipped" data-position="top" data-tooltip="Password must alphanumeric (also allowed: @!#$%^*(){<>},;`~) and be 8 - 20 characters and <br> contain at least one uppercase letter, one lowercase letter and one digit">info</i>
          </div>
        </div>
        <div className="row">
          <div className="col s10 input-field">
            <input className={fieldsClass.confirmPassword} onChange={handleChange} value={userInfo.confirmPassword} type="password" name="confirmPassword" />
            <label>Confirm Password </label>
          </div>
          <div className="col s2 info-tooltip">
            <i className="material-icons tooltipped" data-position="top" data-tooltip="Enter the same password you used.">info</i>
          </div>
        </div>
        <div className="left-align">
          <button ref={signUpBtnReff} className="btn" disabled={!allValid} type="submit">sign up</button>
        </div>
      </form>
      <ul className='errors red-text'>
        {errors && errors.split('\n').filter(val => val && val.trim() !== '').map((error, index) =>
          <li key={index}>{error}</li>
        )}
      </ul>
    </div>
  )
}

export default Signup
