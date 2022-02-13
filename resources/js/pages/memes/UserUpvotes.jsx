import React, { useEffect } from 'react'
import MemesList from '../../components/memes/MemesList'
import { useWebContext } from '../../contexts/WebContext'
import { Redirect } from 'react-router'

/**
 * Display a list of memes the user upvoted 
 */
const UserUpvotes = () => {
  const { showUserUpvotes, upvotesList } = useWebContext();

  useEffect(() => {
    if (upvotesList) {
      showUserUpvotes();
    }
  }, [upvotesList]);
  return (
    !document.cookie.includes("user-details") ? <Redirect to="/" /> : <div>
      <h3> My Upvotes: </h3>
      <MemesList />
    </div>
  )
}

export default UserUpvotes;
