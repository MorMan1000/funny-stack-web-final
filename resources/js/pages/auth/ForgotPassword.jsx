import React, { useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import '../../../css/auth.css'
import Loading from '../../components/Loading';

//This page handles a case of forgotten password by taking the user's email and calls the backend to send a mail with reset link.

//Forgot Password component
const ForgotPassword = () => {
  const emailRef = useRef(null);
  const btnRef = useRef(null);
  const { resetPassword, errors, setErrors, loading } = useAuth();

  //Called when user submitted the form. If email field is not empty, the function sends request to the server with the user's email to send password reset mail.
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors('');
    if (emailRef.current.value.length > 0) {
      btnRef.current.disabled = true;
      resetPassword(emailRef.current.value)
    }
    else {
      setErrors("Please enter your email")
    }
  }

    ;
  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <p>Enter your email to reset your password</p>
        <div className="input-field">
          <input id="email" type="email" ref={emailRef} required />
          <label htmlFor="email">Email</label>
        </div>
        <ul className='errors red-text'>
          {errors && errors.split('\n').filter(val => val && val.trim() !== '').map((error, index) =>
            <li key={index}>{error}</li>
          )}
        </ul>
        <button ref={btnRef} className="btn" type="submit">submit</button>
        {loading && <Loading />}
      </form>
    </div>

  )
}

export default ForgotPassword
