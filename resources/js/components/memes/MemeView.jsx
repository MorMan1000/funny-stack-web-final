import React from 'react'

/*This components returns a meme with its details for reading.
By clicking the "Edit" button user can edit this meme.*/
function MemeView({ memeTitle, created_at, updated_at, setIsEditing, isMemeOwner, deleteUpvote, upvoteMeme, upvoteId, memeUpvotes, isLoggedIn }) {
  const editText = isMemeOwner ? "Edit" : "Edit Copy";
  const editMeme = () => {
    setIsEditing(true)
  }
  return (
    <div className="container">
      <h2>{memeTitle}</h2>
      <p>Created at: {created_at}</p>
      <p>Last Change: {updated_at}</p>
      <p>Upvotes: {memeUpvotes}</p>
      {
        <button className="btn" onClick={editMeme}>{editText}</button>
      }{isLoggedIn && !isMemeOwner &&
        <div>
          <button disabled={upvoteId === -1} className={`${upvoteId ? "upvoted" :
            "unvoted"} btn upvote-btn`} onClick={() => {
              upvoteId ? deleteUpvote(upvoteId) : upvoteMeme();
            }}><i className="material-icons">thumb_up</i></button>
        </div>
      }
    </div>
  )
}

export default MemeView
