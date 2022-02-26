import React, { useEffect, useRef, useState } from 'react'
import { useWebContext } from '../../contexts/WebContext'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useParams } from 'react-router-dom'
import MemesSilider from '../memes/MemesSlider'

/**
 * A page to see information about a user (As another user or guest)
 */
const UserPage = () => {
  const { userData, followUser, followings, unfollowUser, getUserData, getUserTopMemes, setIsEditing } = useWebContext();
  const followBtn = useRef(null);
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const [topMemes, setTopMemes] = useState([]);
  const followClick = () => {
    followBtn.current.disabled = true;
    if (followBtn.current.followId === -1) {
      followUser().then((followId) => {
        followBtn.current.followId = followId;
      }
      );
    }
    else {
      unfollowUser(followBtn.current.followId);
      followBtn.current.followId = -1;
    }
  };
  useEffect(() => {
    getUserData(userId);
    getUserTopMemes(userId).then((topMemes) => {
      setTopMemes(topMemes);
    });
  }, [])

  useEffect(() => {
    if (followBtn.current && currentUser.hasOwnProperty("userId")) {
      followBtn.current.disabled = false;
      const follower = followings.find(follower => follower["userId"] == userId);
      if (follower) {
        followBtn.current.innerText = "unfollow"
        followBtn.current.followId = follower["followId"];
      }
      else {
        followBtn.current.followId = -1;
        followBtn.current.innerText = "follow"
      }
    }
  }, [followings])
  return (
    <div className="container">
      <div className='row'>
        <div className='col s12 l6'>
          <h3> {userData.displayName} </h3>
          <p>Total Followers: {userData.followers}</p>
          <p>Total Memes: {userData.memes}</p>
          <Link to={"/user-memes/" + userData.userId}>Check Memes</Link>
          {(currentUser.hasOwnProperty("userId") && currentUser.userId != userData.userId) &&
            <div>
              <button ref={followBtn} type="button" className="btn" title="follow" onClick={followClick}>follow</button>
            </div>
          }
        </div>
        <div className='col s12 l6'>
          {topMemes.length > 0 && <MemesSilider setIsEditing={setIsEditing} memes={topMemes} />}
        </div>
      </div>
    </div>
  )
}

export default UserPage
