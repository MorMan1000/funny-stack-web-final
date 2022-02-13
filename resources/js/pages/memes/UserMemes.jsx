import React, { useEffect } from 'react'
import MemesList from '../../components/memes/MemesList'
import { useWebContext } from '../../contexts/WebContext'
import { useAuth } from '../../contexts/AuthContext'
import { Redirect, useParams } from 'react-router'
import Paging from '../../components/Paging';

/**
 This component returns a list of the memes created by tne user
 */
const UserMemes = () => {
  const { userId } = useParams();
  const { getUserMemes, numOfPages, userData, getUserData } = useWebContext();
  const { currentUser } = useAuth();

  useEffect(() => {
    getUserMemes(userId);
    if (!document.cookie.includes("user-details" && userData.userId === -1)) {
      getUserData(userId);
    }
  }, []);

  useEffect(() => {
    if (currentUser.hasOwnProperty("userId") && currentUser.userId != userData.userId) {
      getUserData(userId)
    }
  }, [currentUser]);

  const pageChanged = (selectedPage) => {
    getUserMemes(userId, selectedPage);
  }

  return (
    <div>
      <h3>{currentUser.userId == userId ? "My Memes:" : userData.displayName + "  Memes:"}</h3>
      <MemesList />
      {numOfPages > 1 && <Paging numOfPages={numOfPages} pageChanged={pageChanged} />
      }
    </div>
  )
}

export default UserMemes;
