import React from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import { Link } from 'react-router-dom';

/**
 * This is the page for resetting user's password. The page can be reached only with the reset link sent to the user's email.
 */
const ResetPassword = () => {
  const location = useLocation();
  const { updatePassword, loading, errors } = useAuth();
  const userId = new URLSearchParams(location.search).get("userId");
  const hash = new URLSearchParams(location.search).get("hash");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\w!?@#$%^*()<>,;`~]{8,}$/;
  const [fieldClasses, setFieldClasses] = useState({ password: '', confirmPassword: '' });
  const btn = useRef(null);
  const [passwordUpdated, setPasswordUpdated] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    btn.current.disabled = true;
    updatePassword(userId, password, hash).then(() => {
      setPasswordUpdated(true);
    }).catch((err) => {
      console.log(err);
      btn.current.disabled = false;
    });
  }

  const passwordChange = (e) => {
    setPassword(e.target.value);
    if (passwordPattern.test(e.target.value)) {
      setFieldClasses({ password: "valid", confirmPassword: e.target.value === confirmPassword ? "valid" : "invalid" });
    }
    else
      setFieldClasses({ ...fieldClasses, password: "invalid" });
  }

  const confirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setFieldClasses({ ...fieldClasses, confirmPassword: e.target.value === password ? "valid" : "invalid" });
  }


  return (
    (userId && hash) ?
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input className={fieldClasses.password} id="password" type="password" onChange={passwordChange} required />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-field">
            <input className={fieldClasses.confirmPassword} id="password" type="password" onChange={confirmPasswordChange} required />
            <label htmlFor="password">Confirm Password</label>
          </div>
          <button ref={btn} disabled={!(fieldClasses.password === "valid" && fieldClasses.confirmPassword === "valid")} type="submit" className='btn'>Reset password</button>
        </form>
        <div className={passwordUpdated ? "" : "hide"}>
          <p>password has been successfully updated</p>
          <Link className='btn' to="/">Continue</Link>
        </div>
        <ul className='errors red-text'>
          {errors && errors.split('\n').filter(val => val && val.trim() !== '').map((error, index) =>
            <li key={index}>{error}</li>
          )}
        </ul>
        {loading && <Loading />}
      </div > : <Redirect to="/" />
  )
}

export default ResetPassword
