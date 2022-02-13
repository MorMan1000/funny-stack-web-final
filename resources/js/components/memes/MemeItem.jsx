import React from 'react'
import { Link } from 'react-router-dom'

//This component returns a meme item of the memes list shown to the user. User may go to this meme page by clicking the details button.
export default function MemeItem({ meme, setIsEditing }) {


  return (
    <article className='meme'>
      <div className='img-container'>
        <img crossOrigin="=anonymous" src={meme.memeImage} />
      </div>
      <div className='meme-footer'>
        <h3>{meme.memeTitle}</h3>
        <h4>{meme.created_at}</h4>
        <Link to={"/meme/" + meme.memeId} onClick={() => {
          //  setMemeData(meme);
          setIsEditing(false);
        }} className='btn btn-primary btn-details'>
          details
        </Link>
      </div>
    </article>
  )
}
