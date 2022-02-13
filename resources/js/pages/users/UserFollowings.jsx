import React from 'react'
import { useWebContext } from '../../contexts/WebContext'
import { Redirect } from 'react-router'
import UsersTable from '../../components/users/UsersTable'

/**
 * Display all user's followings
 */
const UserFollowings = () => {
  const { followings, redirectToUserPage } = useWebContext();

  return document.cookie.includes("user-details") ? (followings.length > 0 ?
    <UsersTable usersList={followings} redirectToUserPage={redirectToUserPage} />
    : <p>No users currently followed</p>
  ) : <Redirect to="/" />

}

export default UserFollowings
