import React from 'react'
import MemeItem from './MemeItem'
import { useWebContext } from '../../contexts/WebContext'
import Loading from '../Loading'

//This components returns a list of all selected memes
const MemesList = () => {
  const { memesList, setMemeData, setIsEditing, loading } = useWebContext();
  const memesListView = memesList.length > 0 ?
    <section className='section'>
      {loading && <Loading />}
      <div className='memes-center'>
        {memesList.map((meme, index) => {
          return <MemeItem key={index} meme={meme} setMemeData={setMemeData} setIsEditing={setIsEditing} />
        })}
      </div>
    </section> : <p>No memes at the moment</p>
  return memesListView;
}

export default MemesList
