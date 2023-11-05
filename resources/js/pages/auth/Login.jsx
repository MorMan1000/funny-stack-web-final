import React, { useRef, useEffect } from 'react'
import GoogleLogin from '../../components/auth/GoogleLogin'
import { useAuth } from '../../contexts/AuthContext'
import { Redirect } from 'react-router';
import '../../../css/auth.css'
import Loading from '../../components/Loading';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
//Login page with email and password, or with google authentiacation.

//Login component
const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const loginBtnRef = useRef(null);
  const { login, errors, setErrors, currentUser, loading } = useAuth();

  //Called when user submitted the form. If fields is not empty, the function sends request to the server with the user credentials.
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors('');
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email && password) {
      emailRef.current.className = "";
      passwordRef.current.className = "";
      loginBtnRef.current.disabled = true;
      login({ email, password });
    }
  }


  useEffect(() => {
    if (errors.length > 0) {
      //Updating the form if the user credentials were not valid.
      loginBtnRef.current.disabled = false
      if (errors) {
        const errorTest = errors.toLowerCase();
        if (errorTest.includes("email")) {
          emailRef.current.className = "invalid";
        }
        if (errorTest.includes("password")) {
          passwordRef.current.className = "invalid";
        }
      }
    }
  }, [errors]);
  return (
    currentUser && Object.keys(currentUser).length > 0 ? <Redirect to="/" /> : <div className="container">
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input id="email" type="email" ref={emailRef} required />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-field">
          <input id="password" type="password" ref={passwordRef} required />
          <label htmlFor="password">Password</label>
        </div>
        <div className="left-align">
          <button ref={loginBtnRef} type="submit" className="btn">Login</button>
          <p>OR</p>
          <GoogleLogin />
          {/* onSuccess={(response) => {
            //   setErrors('');
            //   console.log("rsp: ", response);
            //   let decoded = jwtDecode(response.credential);
            //   console.log("decoded: ", decoded);
            //   //login({ email: res.profileObj.email, tokenId: res.tokenId });
            // }}
            // onError={(response) => {
            //   setErrors('Login failed, make sure you use the gmail you signed up with');
            //   console.log("login failed: " + response);
            // }}  */}
        </div>
        <Link to="forgot-password" >Forgot Password</Link>
      </form>
      <ul className='errors red-text'>
        {errors && errors.split('\n').filter(val => val && val.trim() !== '').map((error, index) =>
          <li key={index}>{error}</li>
        )}
      </ul>
    </div>
  )
}

export default Login
