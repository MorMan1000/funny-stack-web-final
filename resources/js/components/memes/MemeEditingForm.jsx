import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRef, useEffect } from 'react';

/**
 This components returns the form with meme fields for creating or editing the meme.
 */
const MemeEditingForm = ({ memeData, setMemeField, saveMeme, drawMeme, defaultFontSize, canvasRef, errors, setErrors, checkMemeChange, isMemeOwner, makeMemeCopy }) => {
  const { currentUser } = useAuth();
  const saveBtn = useRef(null);


  useEffect(() => {
    if (Object.keys(currentUser).length > 0 && !isMemeOwner) {
      makeMemeCopy();
    }
  }, []);

  //Treiggers when meme text changes and updates the meme state.
  const memeTextChanged = (e, index) => {
    canvasRef.current.isUpdated = false; //alert that the meme canvas should be updated
    const text = e.target.value;
    let textsArr = [...memeData.memeTexts.value];
    textsArr[index] = { ...memeData.memeTexts.value[index], text: text };

    setMemeField("memeTexts", textsArr);
    checkMemeChange("memeTexts", textsArr);
  }
  const changeTextSize = (e) => {
    const newTextSize = defaultFontSize * parseInt(e.target.value) / 50;
    canvasRef.current.isUpdated = false; //alert that the meme canvas should be updated
    setMemeField("textSize", newTextSize);
    checkMemeChange("textSize", newTextSize);

  }

  //Triggers when the text color is changed by the user. The change is set in the state.
  const textColorChange = (e) => {
    canvasRef.current.isUpdated = false; //alert that the meme canvas should be updated
    setMemeField("textColor", e.target.value);
    checkMemeChange("textColor", e.target.value);
  }

  //Triggers when the outline color is changed by the user. The change is set in the state.
  const outlineColorChange = (e) => {
    canvasRef.current.isUpdated = false; //alert that the meme canvas should be updated
    setMemeField("outlineColor", e.target.value);
    checkMemeChange("outlineColor", e.target.value);
  }

  //Triggers when the title is changed by the user. The change is set in the state.
  const memeTitleChange = (e) => {
    setMemeField("memeTitle", e.target.value);
    checkMemeChange("memeTitle", e.target.value);
  }

  /**
   * Add one more text to the mene
   */
  const addMemeText = () => {
    canvasRef.current.isUpdated = false; //alert that the meme canvas should be updated
    setMemeField("memeTexts", [...memeData.memeTexts.value, { text: "", xPos: 0, yPos: 0 }])
  }

  /**
   * 
   * @param {integer} textIndex - index (start from zero) of the selected text to delete.
   */
  const deleteMemeText = (textIndex) => {
    canvasRef.current.isUpdated = false; //alert that the meme canvas should be updated
    const memeTexts = memeData.memeTexts.value.filter((memeText, index) => index !== textIndex);
    setMemeField("memeTexts", memeTexts);
  }

  //When the meme is submitted - the meme is drawn and saved in the server.
  const memeSubmit = (e) => {
    e.preventDefault();
    if (memeData.memeOriginImage.value) {
      saveBtn.current.disabled = true;
      if (!canvasRef.current.isUpdated)
        drawMeme();
      if (!memeData.memeTitle.value)
        setErrors(errors + "\n" + "meme title is missing")
      else {
        saveMeme(canvasRef.current.urlLink);
      }
    }
    else
      setErrors(errors + "\n" + "Image was not uploaded")
  }

  return (
    <form onSubmit={memeSubmit}>
      <div className="input-field">
        <button data-target="uploadModal" id="uploadBtn" className="waves-effect waves-light btn modal-trigger" title="Upload Image"><i className="material-icons">file_upload</i></button>
      </div>
      <div className="input-field">
        <input type="text" id="memeTitle" name="memeTitle" value={memeData.memeTitle.value} onChange={memeTitleChange} required />
        <label className="active" htmlFor="memeTitle">Meme Title</label>
      </div>
      {
        memeData.memeTexts.value.map((memeText, index) => {
          return (
            <div key={index} className="input-field">
              <textarea id={`text${index + 1}`} className="materialize-textarea" value={memeText.text} onChange={(e) => memeTextChanged(e, index)}></textarea>
              <label className="active" htmlFor={`text${index + 1}`}>Meme Text {index + 1}</label>
              {index >= 1 && <button type="button" className="delete-meme-text"><i className="material-icons" onClick={() => deleteMemeText(index)}>delete</i></button>}
            </div>
          )
        })
      }
      <button type="button" className="btn" onClick={addMemeText}><i className="material-icons">add</i></button>
      <div className="input-field">
        <p>Text Size:</p>
        <p className="range-field">
          <input type="range" onChange={changeTextSize} min="1 " max="100" />
        </p>
      </div>
      <div id="colorsSelect">
        <div>
          <label>Text Color</label>
          <input type="color" value={memeData.textColor.value} id="colorText" onChange={textColorChange} />
        </div>
        <div>
          <label>Text Outline Color</label>
          <input type="color" value={memeData.outlineColor.value} onChange={outlineColorChange} />
        </div>
      </div>
      <div>
        {currentUser?.userId && <button type="submit" className="btn" title="Save meme" ref={saveBtn}>
          <i className="material-icons">save</i></button>}
      </div>
      <ul className='errors red-text'>
        {errors && errors.split('\n').filter(val => val && val.trim() !== '').map((error, index) =>
          <li key={index}>{error}</li>
        )}
      </ul>
    </form >
  )
}

export default MemeEditingForm
