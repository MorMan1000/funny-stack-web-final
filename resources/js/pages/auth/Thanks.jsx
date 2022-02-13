import React from 'react'

//This component shows up after a user sucessfully signed up and informs the user about verefication link sent to their mail.
const Thanks = () => {
  return (
    <div className="container">
      <h1>Thank you for signing up!</h1>
      <p>You are almost finished. <br /> A verification link has been sent to your email. Check this out <i className="material-icons">tag_faces</i></p>
    </div >
  )
}

export default Thanks
