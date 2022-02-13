import React, { useEffect, useRef, useState } from 'react';
import MemesList from '../../components/memes/MemesList';
import UsersTable from '../../components/users/UsersTable';
import { useWebContext } from '../../contexts/WebContext';
import Paging from '../../components/Paging';

/**
 This is a page for searching memes on the website
 */

const FindMemes = () => {
  const {
    getPopularMemes,
    searchMemes,
    showPopularMemes,
    numOfPages,
    searchUsers,
    redirectToUserPage
  } = useWebContext();
  const query = useRef(null);
  const searchOptions = useRef(null);
  const currList = useRef("memes");
  const [resultsList,
    setResultsList] = useState(<MemesList />);

  useEffect(() => {
    if (showPopularMemes.current) getPopularMemes(1);
  }

    , []);

  const pageChanged = (selectedPage) => {
    if (currList.current === "memes") {
      !showPopularMemes.current ? getPopularMemes(selectedPage) : searchMemes(query.current.value, selectedPage);
      setResultsList(<MemesList />);
    }

    else {
      searchUsers(query.current.value, selectedPage).then((val) => {
        setResultsList(<UsersTable usersList={val} redirectToUserPage={redirectToUserPage}
        />)
      }
      );;
    }
  }

  const searchClick = () => {
    if (query.current.value) {
      if (searchOptions.current.value === "memes") {
        searchMemes(query.current.value, 1)
        currList.current = "memes"
      }
      else {
        currList.current = "users"
        searchUsers(query.current.value, 1).then((val) => {
          setResultsList(val.length > 0 ? <UsersTable usersList={val} redirectToUserPage={redirectToUserPage}
          /> : <p>No results</p>)
        }
        );
      }
    }
  }

  return (<div> <h3> Search On Website </h3> <select ref={
    searchOptions
  }

  > <option value="memes" >memes</option> <option value="users">users</option> </select> <div id="searchMemes" className="input-field">
      <input ref={query} id="search" type="text" /> <button onClick={searchClick}
        className="btn" type="submit"><i className="material-icons">search</i></button> </div> {
      resultsList
    }

    {
      numOfPages > 1 && <Paging numOfPages={
        numOfPages
      }

        pageChanged={
          pageChanged
        }

      />
    }

  </div>)
}

export default FindMemes;