import React, { useEffect } from 'react'
import MemesList from '../components/memes/MemesList'
import { useWebContext } from '../contexts/WebContext'

const Home = () => {
  const { getLastMemesUploads } = useWebContext();
  useEffect(() => {
    getLastMemesUploads();
  }, []);
  return (
    <div>
      <h3> Last Uploads: </h3>
      <MemesList />
    </div>
  )
}

export default Home
