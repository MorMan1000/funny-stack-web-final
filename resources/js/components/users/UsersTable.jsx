import React from 'react'

/**
 * A table displays a collection of selected users
 */
const UsersTable = ({ usersList, redirectToUserPage }) => {
  return (
    <table id="usersTable" className="centered responsive-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Total Followers</th>
          <th>Total Memes</th>
        </tr>
      </thead>
      <tbody>
        {
          usersList.map((user) => <tr key={user.userId} onClick={() => {
            redirectToUserPage(user)
          }}>
            <td>{user.displayName}</td>
            <td>{user.followers}</td>
            <td>{user.memes}</td>
          </tr>)
        }
      </tbody>
    </table>
  )
}

export default UsersTable
