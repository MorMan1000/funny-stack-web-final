import React, { useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext'
import axios from 'axios'
import history from '../history';


//The memes provider saves the memes state, performs the memes actions by interacting with the server for both users and guests.


/**
 * This function returns an empty meme data object with initial default values.
 * @returns empty meme data object.
 */
export const getEmptyMeme = () => {
  return {
    memeId: -1,
    memeTitle: { value: "", updated: false },
    memeTexts: {
      value: [{ text: "", xPos: 0, yPos: 0 }, { text: "", xPos: 0, yPos: 0 }
      ], updated: false
    },
    memeImage: { value: "", updated: false },
    memeOriginImage: { value: "", updated: false },
    textSize: { value: 0, updated: false },
    textColor: { value: "#ffffff", updated: false },
    outlineColor: { value: "#000000", updated: false },
    created_at: "",
    updated_at: "",
    upvotes: 0,
    userDisplayName: ""
  }
}


const WebContext = React.createContext();
//Costum hook used to get this context data within other components.
export const useWebContext = () => {
  return useContext(WebContext);
};

export const WebProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [upvotesList, setUpvotesList] = useState(null);
  const [apiImages, setApiImages] = useState(null)
  const [errors, setErrors] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [memeData, setMemeData] = useState(getEmptyMeme());
  const [memesList, setMemesList] = useState([]);
  const { currentUser } = useAuth();
  const [isMemeOwner, setIsMemeOwner] = useState(false);
  const showPopularMemes = useRef(true);
  const [numOfPages, setNumOfPages] = useState(0);
  const [userData, setUserData] = useState({ userId: -1, displayName: "", followers: 0, memes: 0 });
  const [followings, setFollowings] = useState([]);
  /**
   * This function saving a meme edited by the user, whether it's new meme or one being updated.
   * @param memeImageUrl 
   */
  const saveMeme = (memeImageUrl) => {
    setLoading(true);
    let url = "/api/memes/"
    let methodType = "POST";
    const meme = {};
    for (const key in memeData) {
      if (typeof memeData[key] == "object" && !memeData[key]?.updated)
        meme[key] = memeData[key].value;
    }
    meme["memeImage"] = memeImageUrl;
    meme["userId"] = currentUser.userId;
    if (meme["memeTexts"])
      meme["memeTexts"] = meme["memeTexts"].filter((memeText) =>
        memeText.text.length > 0);
    if (memeData.memeId === -1) {
      url += "create"
    }
    else {
      url += "update/" + memeData.memeId;
      methodType = "PUT";
    }

    axios({
      url: url,
      method: methodType,
      data: JSON.stringify(meme),
      headers: { 'Content-type': 'application/json' }
    }).then(response => {
      console.log(response);
      if (response) { //Check for errors in the server's respnse.
        const data = response.data;
        let meme = JSON.parse(data);
        let updatedMeme = { ...memeData, memeId: parseInt(meme.memeId), memeImage: { value: meme.memeImage }, memeOriginImage: { value: meme.memeOriginImage }, created_at: meme.created_at, updated_at: meme.updated_at }
        for (const key in updatedMeme) {
          if (typeof updatedMeme[key] == "object")
            updatedMeme[key].updated = true;
        }
        setMemeData(updatedMeme);
        setIsEditing(false);
        history.push("/meme/" + meme.memeId);
        let newMemesList = [...memesList.filter((meme) =>
          meme.memeId !== updatedMeme.memeId
        ), meme];
        setMemesList(newMemesList);
        setIsMemeOwner(true);
      }
      else {
        setErrors("error saving the meme")
      }
    }).catch(err => {
      console.log(err);
      setErrors("error saving the meme")
    })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Calling the backend to search users with display name matched with a string given by the user
   * @param input - the string input to match the results with
   * @param selectedPage - the selcted page of the results list
   * @returns  an array of the matched user, limited to items per page set in the backend
   */
  const searchUsers = async (input, selectedPage) => {
    setLoading(true);
    const response = await axios.get("api/users/search?query=" + input + "&page=" + selectedPage);
    setLoading(false);
    const data = JSON.parse(response.data);
    const users = data.data;
    setNumOfPages(data.last_page);
    return users;
  }
  /**
   * This function takes a meme object returned from the server and add it update property to each field, to keep track of user changes.
   * @param meme - A meme object returned from the server.
   */

  /**
   * Add to meme object fields an updated property, to keep track of changes while editing 
   * @param meme - a meme object
   */
  const addUpdateFieldToMemes = (meme) => {
    for (const key in meme) {
      if (!["memeId", "created_at", "updated_at", "userId", "upvotes", "userDisplayName"].includes(key))
        meme[key] = { value: meme[key], updated: true }
    }
  }

  /**
   * This function takes a meme object edited by the user and removes all update propeties, so the meme can be sent to the server properly.
   * @param meme - a meme object with update - fiedls
   * @returns - a meme object corresponds to the server specified format.
   */
  const removeUpdateFieldToMemes = (meme) => {
    for (const key in meme) {
      if (typeof meme[key] === "object")
        meme[key] = meme[key].value;
    }
    return meme;
  }

  /**
   * This functions retrieves from the server the 30 newest memes.     
   */
  const getLastMemesUploads = async () => {
    try {
      setLoading(true);
      const url = "/api/memes/last-memes";
      const options = {
        headers: { 'Content-type': 'application/json' }
      };
      const response = await axios.get(url, options);
      if (response && response.status === 200) {
        console.log(response);
        let memesList = JSON.parse(response.data).data;
        setMemesList(memesList);
      }
      else {
        setErrors("Error occured while retrieving the memes")
      }
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    };
  }


  /**
   *This function retrieves a meme object by using its unique Id.
   * @param memeId  - The identifier of the selcted meme
   */
  const getMeme = (memeId) => {
    if (memesList.length > 0) {
      let meme = { ...memesList.find((meme) => meme.memeId === memeId) };
      if (meme) {
        addUpdateFieldToMemes(meme);
        setMemeData(meme);
        setIsMemeOwner(meme.userId === currentUser.userId);
      }
    }
    else
      getMemeFromServer(memeId);
  }


  /**
     *This function retrieves a meme object from server side by using its unique Id.
     * @param memeId  - The identifier of the selcted meme
     */
  const getMemeFromServer = (memeId) => {
    const url = "/api/memes/" + memeId;
    const options = {
      headers: { 'Content-type': 'application/json' }
    };
    axios.get(url, options).then(response => {
      console.log(response);
      const meme = JSON.parse(response.data);
      addUpdateFieldToMemes(meme);
      setMemeData(meme);
      setIsMemeOwner(meme.userId === currentUser.userId);
    });
  }

  /**
   * This function creates a new meme object with the same properties of an existing selcted meme.
   */
  const makeMemeCopy = () => {
    const meme = { ...memeData };
    meme.memeId = -1;
    delete meme.userId;
    for (const key in meme)
      if (typeof meme[key] === "object") {
        meme[key] = { ...meme[key], updated: false }
      }
    setMemeData(meme);
  }

  /**
   * @param userId - getting non-confidential user details
   */
  const getUserData = async (userId) => {
    const response = await axios.get("/api/users/" + userId);
    setUserData(JSON.parse(response.data));
  }

  useEffect(() => {
    console.log("location: " + history.location.pathname);
    getApiImages();
  }, []);

  const redirectToUserPage = (user) => {
    setUserData(user);
    history.push("/user/" + user.userId);
  }

  /**
   * Requesting the server to save a following of a user
   * @returns - a following id
   */
  const followUser = async () => {
    const response = await axios.post("/api/users/follow?userId=" + userData.userId + "&followerId=" + currentUser.userId);
    const followId = response.data;
    setUserData({ ...userData, followers: userData.followers + 1 });
    setFollowings([...followings, { followId: followId, userId: userData.userId }]);
    return followId;
  }

  /**
   * Requesting the server to save a following of a user
   * @param followId - id of the following to delete
   */
  const unfollowUser = async (followId) => {
    const response = await axios.delete("/api/users/follow/" + followId);
    setUserData({ ...userData, followers: userData.followers - 1 });
    setFollowings(followings.filter(following => following.followId != followId));
  }

  /**
   * Requesting the server a list of all users followed by the logged user
   */
  const getUserFollowings = async () => {
    const response = await axios.get("/api/user/followers?userId=" + currentUser.userId);
    setFollowings(JSON.parse(response.data));
  }

  /**
   * This function updates an upvote of the user for a selected meme and calls for saving it on the server side. 
   */
  const upvoteMeme = () => {
    const url = "/api/user/upvote";
    const options = {
      headers: { 'Content-type': 'application/json' }
    };
    let upvoteData = { userId: currentUser.userId, memeId: memeData.memeId };
    axios.post(url, upvoteData, options).then(response => {
      console.log(response);
      const upvoteId = JSON.parse(response.data);
      const meme = removeUpdateFieldToMemes({ ...memeData, "upvotes": memeData.upvotes + 1 });
      setUpvotesList([...upvotesList, { ...meme, upvoteId }]);
      setMemeData({ ...memeData, "upvotes": memeData.upvotes + 1 });
    });
  }

  /**
   * This function deletes an upvote of the user for a selected meme and calls for deleting it on the server side.
   */
  const deleteUpvote = (upvoteId) => {
    const url = "/api/user/upvote/" + upvoteId;
    const options = {
      headers: { 'Content-type': 'application/json' }
    };
    let upvoteData = { userId: currentUser.userId, memeId: memeData.memeId };
    axios.delete(url, upvoteData, options).then(response => {
      console.log(response);
      upvoteData.upvoteId = JSON.parse(response.data);
      setUpvotesList(upvotesList.filter((upvote) => upvote.upvoteId != upvoteId));
      setMemeData({ ...memeData, "upvotes": memeData.upvotes - 1 });
    });
  }



  useEffect(() => {
    if (currentUser.hasOwnProperty('userId')) {
      getUserUpvotes();
      getUserFollowings();
    }
  }, [currentUser]);

  /**
   * This function retrieves a list of all the memes that the current user upvoted for.
   */
  const getUserUpvotes = () => {
    const url = "/api/user/upvotes?userId=" + currentUser.userId;
    const options = {
      headers: { 'Content-type': 'application/json' }
    };
    axios.get(url, options).then(response => {
      const upvotedMemes = JSON.parse(response.data);
      setUpvotesList(upvotedMemes);
      console.log("upvotes list: ", JSON.parse(response.data));
    }).catch(err => {
      console.log(err);
    })

  }

  /**
   * getting meme images from an external api url.
   */
  const getApiImages = () => {
    try {
      const url = "https://api.imgflip.com/get_memes";
      axios.get(url).then((response) => {
        const data = response.data;
        setApiImages(data.data.memes);
      })
    }
    catch (err) {
      console.log(err);
    }

  }

  /**
   * A format of the meme date fields
   * @param date -  full date 
   * @returns A date in the format: YY-MM-DD hh:mm:ss
   */
  const formatMemeDate = (date) => {
    let [datePart, timePart] = date.split("T");
    timePart = timePart.split(".")[0];
    return datePart + " " + timePart;
  }

  /**
   * This function get memes created by the users according to the current page on the list
   * @param selectedPage - the selected page to go on the memes list
   */
  const getUserMemes = (userId, selectedPage) => {
    setLoading(true);
    const url = "/api/memes/get-user-memes/" + userId + "?page=" + selectedPage;
    const options = {
      headers: { 'Content-type': 'application/json' }
    };
    axios.get(url, options).then(response => {
      console.log(response);
      let data = JSON.parse(response.data);
      const memesList = data.data;
      setMemesList(memesList);
      setNumOfPages(data.last_page);
    }).catch(err => {
      console.log(err);
    })
      .finally(() => {
        setLoading(false);
      });
  }

  /**
   * Deleting a selected meme created by the user from the website.
   */
  const deleteMeme = () => {
    setLoading(true);
    axios.delete("/api/memes/delete/" + memeData.memeId).then((response) => {
      if (response.data == "1") {
        setMemesList(memesList.filter((meme) =>
          meme.memeId !== memeData.memeId
        ));
        history.push("/")
      }
    }).catch((err) => {
      console.log("error: ", err);
    }).finally(() => {
      setLoading(false);
    });
  }


  /**
   * Set a new value for a selected field in the meme object.
   * @param field - The selected field tp update it's value
   * @param  value - the value for the selected field.
   */
  const setMemeField = (field, value) => {
    setMemeData({ ...memeData, [field]: { value: value, updated: false } });
  }

  /**
   * Set a new values for a selected field ins the meme object.
   * @param data - An object containing the new values for the fields in a key value format: {field1: value1, field2: value2}
   */
  const setMemeFields = (data) => {
    let dataToAdd = {};
    for (let d in data) {
      dataToAdd[d] = { value: data[d], updated: false };
    }
    setMemeData({ ...memeData, ...dataToAdd });
  }


  const getUserTopMemes = async (userId) => {
    try {
      const response = await axios.get("/api/memes/user-top-memes?userId=" + userId);
      const topMemes = JSON.parse(response.data);
      return topMemes;
    }
    catch (err) {

    }
  }

  /**
   * Reset the meme object to an intial empty meme state.
   */
  const resetMemeData = () => {
    setMemeData(getEmptyMeme);
  }

  /**
   * Show the user all the upvoted memes.
   */
  const showUserUpvotes = () => {
    setMemesList(upvotesList);
  }

  /**
   * Get a list of memes sorted by the upvotes amount with paging.
   * @param selectedPage - the selected page to go on the memes list
   */
  const getPopularMemes = (selectedPage) => {
    showPopularMemes.current = false;
    setLoading(true);
    const url = "/api/memes/popular-memes/?page=" + selectedPage;
    const options = {
      headers: { 'Content-type': 'application/json' }
    };
    axios.get(url, options).then(response => {
      console.log(response);
      const memesPage = JSON.parse(response.data)
      let memes = memesPage.data;
      setNumOfPages(memesPage.last_page);
      setMemesList(memes);
    }).catch((err) => {
      console.log("err");
    }).finally(() => {
      setLoading(false);
    });
  }

  /**
   * This function retrieves a memes list with a title that is partially or fully matched to the search text input.
   * @param  title - the title given in the search text input
   * @param selectedPage - the selected page to go on the memes list
   */
  const searchMemes = (title, selectedPage) => {
    if (title) {
      setLoading(true);
      showPopularMemes.current = true;
      const url = "/api/memes/search?title=" + title + "&page=" + selectedPage;
      const options = {
        headers: { 'Content-type': 'application/json' }
      };
      axios.get(url, options).then(response => {
        console.log(response);
        const memesPage = JSON.parse(response.data)
        let memes = memesPage.data;
        setNumOfPages(memesPage.last_page);
        setMemesList(memes);
      }).catch((err) => {
        console.log("err");
      }).finally(() => {
        setLoading(false);
      });
    }
    else if (!showPopularMemes.current) {
      getPopularMemes();
    }
  }
  useEffect(() => {
    if (currentUser.hasOwnProperty("userId"))
      setIsMemeOwner(memeData.userId === currentUser.userId);
  }, [currentUser, memeData]);

  useEffect(() => {
    if (!showPopularMemes.current && history.location.pathname !== "/find-memes")
      showPopularMemes.current = true;
  }, [memesList])
  const value = {
    saveMeme,
    apiImages,
    errors,
    setErrors,
    isEditing,
    memesList,
    memeData,
    setMemeField,
    setMemeFields,
    setMemeData,
    setIsEditing,
    deleteMeme,
    getMeme,
    getUserMemes,
    getLastMemesUploads,
    resetMemeData,
    makeMemeCopy,
    loading,
    isMemeOwner,
    setIsMemeOwner,
    upvoteMeme,
    upvotesList,
    deleteUpvote,
    showUserUpvotes,
    getPopularMemes,
    searchMemes,
    showPopularMemes,
    numOfPages,
    searchUsers,
    redirectToUserPage,
    userData,
    followUser,
    followings,
    unfollowUser,
    getUserData,
    getUserTopMemes
  };

  return (
    <WebContext.Provider value={value}>
      {children}
    </WebContext.Provider>
  );
};



