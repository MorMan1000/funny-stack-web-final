import React, { useRef, useState, useEffect } from 'react'
import MemesFromApi from './MemesFromApi'
import M from 'materialize-css/dist/js/materialize.min.js'

//This components returns the modal for selecting an image for the meme. User can select image from their local machine, from image url or from api images suggested by the website. 
const MemeImageModal = ({ setMemeField, onLoad }) => {
  const [errors, setErrors] = useState('');
  const selectedApiMeme = useRef(null);
  const imageFileRef = useRef(null);
  const imageUrlInput = useRef(null);
  const [selectedRadio, setSelectedRadio] = useState('file');
  const [modalInstance, setModalInstance] = useState(null);

  useEffect(() => {
    const elems = document.querySelectorAll('.modal');
    const instance = M.Modal.init(elems, {})[0]
    setModalInstance(instance);
  }, [])
  const showSelectedImage = () => {
    try {
      setErrors('');
      if (selectedRadio == "file") {
        if (imageFileRef.current.files && imageFileRef.current.files[0]) {
          const fileName = imageFileRef.current.files[0].name;
          if (fileName.endsWith("png") || fileName.endsWith("jpg") || fileName.endsWith("jpeg")) {
            const fReader = new FileReader();
            fReader.onloadend = function (event) {
              modalInstance?.close();
              setMemeField("memeOriginImage", event.target.result);
            }
            fReader.readAsDataURL(imageFileRef.current.files[0]);
          }
          else {
            setErrors("Invalid file. make sure you select an image file");
          }
        }
        else {
          setErrors("File was not selected")
        }
      }
      else if (selectedRadio == "url") {
        setMemeField("memeOriginImage", imageUrlInput.current.value);
        onLoad();
        modalInstance?.close();
      }
      else {
        if (selectedApiMeme.current) {
          setMemeField("memeOriginImage", selectedApiMeme.current.src);
          modalInstance?.close();
        }
        else {
          setErrors("Please select image")
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const optionChanged = (option) => {
    setSelectedRadio(option);
  }



  return (
    //modal structure
    <div id="uploadModal" className="modal">
      <div className="modal-content">
        <h4>Upload Image</h4>
        <div>
          <p>
            <label>
              <input name="imageUpload" onChange={() => optionChanged("file")} type="radio" defaultChecked />
              <span>Upload local image file</span>
            </label>
          </p>
          <div className="file-field input-field">
            <div className="btn">
              <span>selcet file</span>
              <input disabled={selectedRadio !== "file"} ref={imageFileRef} type="file" accept="image/*" />
            </div>
            <div className="file-path-wrapper">
              <input disabled={selectedRadio !== "file"} className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <p>
            <label>
              <input name="imageUpload" type="radio" onChange={() => optionChanged("url")} />
              <span>Upload image from URL</span>
            </label>
          </p>
          <div className="input-field">
            <input disabled={selectedRadio !== "url"} ref={imageUrlInput} type="text" name="" id="imageUrlInput" />
            <label htmlFor="imageUrlInput" className="active">Enter image URL</label>
          </div>
        </div>
        <div>
          <p>
            <label>
              <input name="imageUpload" type="radio" onChange={() => optionChanged("api")} />
              <span>Select one of the following images: </span>
            </label>
          </p>
          <MemesFromApi selectedApiMeme={selectedApiMeme} selectedRadio={selectedRadio} />
        </div>
      </div>
      <p>{errors}</p>
      <div className="modal-footer">
        <button onClick={showSelectedImage} className="waves-effect waves-green btn-flat">OK</button>
      </div>

    </div>
  )
}

export default MemeImageModal
