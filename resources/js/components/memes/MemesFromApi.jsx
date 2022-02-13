import React, { useState } from 'react'
import { useWebContext } from '../../contexts/WebContext';

//This component retuns collection of images from an api, so the user may select one of them in the Image uploading modal while creating the meme
const MemesFromApi = ({ selectedApiMeme, selectedRadio }) => {
  const { apiImages } = useWebContext();
  const [imageIndex, setImageIndex] = useState(0);
  const apiImagesMove = (num) => {
    if (num === (apiImages.length / 20))
      setImageIndex(0);
    else if (num === -1)
      setImageIndex((apiImages.length / 20) - 1);
    else
      setImageIndex(num)
  }
  return (
    <div>
      <div>
        <button className="images-nav" onClick={() => apiImagesMove(imageIndex - 1)} ><i className='material-icons'>arrow_back</i></button>
        <button className="images-nav" onClick={() => apiImagesMove(imageIndex + 1)} ><i className="material-icons">arrow_forward</i></button>
      </div>
      <div className="images-container">
        {
          apiImages && apiImages.slice(imageIndex * 20, (imageIndex + 1) * 20).map((image) => {
            return (
              <div key={image.id} className="image-wrapper">
                <img className="materialboxed" src={image.url} onClick={(e) => {
                  if (selectedRadio === "api") {
                    if (selectedApiMeme.current) {
                      selectedApiMeme.current.style = "none";
                    }
                    selectedApiMeme.current = e.target;
                    e.target.style.border = "1.5px solid black";
                  }
                }} />
              </div>
            );
          })
        }
      </div>
    </div>
  )
}

export default MemesFromApi
