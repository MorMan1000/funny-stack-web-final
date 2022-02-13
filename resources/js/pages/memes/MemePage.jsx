import React, { useEffect, useRef, useState } from 'react'
import interact from 'interactjs'
import { useWebContext, getEmptyMeme } from '../../contexts/WebContext'
import { useAuth } from '../../contexts/AuthContext'
import MemeImageModal from '../../components/memes/MemeImageModal'
import MemeView from '../../components/memes/MemeView'
import MemeEditingForm from '../../components/memes/MemeEditingForm'
import { useParams } from 'react-router'
import { Link, Prompt, useLocation } from 'react-router-dom'
import Loading from '../../components/Loading'
import { compareArrays, compareObjects } from '../../utils'

/**
 This is A page used to show meme and it's details and to edit them
 */
const MemePage = () => {
  const { memeData, setMemeField, setMemeFields, saveMeme, errors, setErrors, isEditing, setIsEditing, deleteMeme, memesList, getMeme, loading, makeMemeCopy, isMemeOwner, setIsMemeOwner, upvoteMeme, upvotesList, deleteUpvote, setMemeData } = useWebContext();
  const location = useLocation();
  const defaultFontSize = useRef(0);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const memeTextsDiv = useRef(null);
  const saveBtn = useRef(null);
  const { currentUser } = useAuth();
  const { memeId } = useParams();
  const [memeDataChanged, setMemeDataChanged] = useState(false);
  const initialMemeData = useRef(false);
  const changedFields = useRef([]);
  //This objects allows the meme text dragging
  interact('.draggable').draggable({
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
      })
    ],
    listeners: {
      start(event) {
        console.log(event.type, event.target);
      },
      move(event) {
        if (isEditing) {
          canvasRef.current.isUpdated = false;
          const index = parseInt(event.target.id) - 1;
          let memeTexts = [...memeData.memeTexts.value];
          let { xPos, yPos } = memeTexts[index];
          xPos = xPos + event.dx;
          yPos = yPos + event.dy;
          memeTexts[index] = { ...memeTexts[index], xPos, yPos };
          setMemeFields({
            "memeTexts": memeTexts
          });
          setMemeDataChanged(true);
        }
      },
    }
  });

  const beforeunload = (event) => {
    if (isEditing) {
      event.returnValue = 'You have unfinished changes!';
    }
  };

  const setUpEditingMeme = () => {
    if (memeData.memeId === -1) {
      const initMeme = getEmptyMeme();
      const xPos = 0.3 * imageRef.current.width;
      let memeTexts = [...initMeme.memeTexts.value];
      for (let memeText of memeTexts) {
        memeText.xPos = xPos
      }
      if (memeTexts.length >= 2) {
        const bottomTextYpos = 0.75 * imageRef.current.height;
        memeTexts[1].yPos = bottomTextYpos;
      }
      setMemeData({ ...initMeme, memeTexts: { value: memeTexts, updated: false } });
    }
  }

  useEffect(() => {
    defaultFontSize.current = parseFloat(window.getComputedStyle(memeTextsDiv.current.querySelector(".memeText")).fontSize.slice(0, -2));
    canvasRef.current = document.createElement("canvas");
    setUpEditingMeme();
    canvasRef.current.isUpdated = false;
    initialMemeData.current = { ...memeData };
  }, []);

  useEffect(() => {
    setUpEditingMeme();
  }, [location])

  useEffect(() => {
    if (memeId && !isNaN(memeId) && memeData.memeId !== memeId) {
      getMeme(parseInt(memeId));
      setIsEditing(false);
    }
  }, [memesList])

  useEffect(() => {
    if (saveBtn && saveBtn.current)
      saveBtn.current.disabled = false;
  }, [errors])

  useEffect(() => {
    if (isEditing) {
      if (memeDataChanged)
        window.removeEventListener('beforeunload', beforeunload);
    }
    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    }
  }, [memeDataChanged]);

  //Checking if the image successfuly loaded 
  const imageOnLoad = () => {
    imageRef.current.imageUploaded = imageRef.current.complete && imageRef.current.naturalHeight !== 0;
    if (imageRef.current.imageUploaded) //If successfuly loaded, alert that the meme canvas should be updated
    {
      canvasRef.current.isUpdated = false;
      checkMemeChange("memeOriginImage", imageRef.current.src);
    }
  }

  //Download the meme to the user machine
  const downloadMeme = () => {
    try {
      if (memeData.memeOriginImage) {
        if (!canvasRef.current.isUpdated && isEditing) {
          drawMeme();
        }
        const urlLink = isEditing ? canvasRef.current.urlLink : memeData.memeImage.value;
        const link = document.createElement('a');
        const memeName = memeData.memeTitle.value;
        link.download = memeName ? memeName + ".png" : 'FunnyStack-Meme.png';
        link.href = urlLink;
        link.click();
      }
      else {
        setErrors(errors + "\n" + "Image was not uploaded")
      }
    }
    catch (err) {
      console.log(err);
      setErrors(errors + "\n" + err)
    }
  }

  //Draw the meme on the canvas.
  const drawMeme = () => {
    const canvasCopy = canvasRef.current;
    canvasCopy.width = imageRef.current.naturalWidth;
    canvasCopy.height = imageRef.current.naturalHeight;
    const ctx = canvasCopy.getContext("2d");
    ctx.clearRect(0, 0, canvasCopy.width, canvasCopy.height);
    drawImageProp(ctx, imageRef.current, 0, 0, canvasCopy.width, canvasCopy.height);
    const { memeTexts, textColor, outlineColor } = memeData;
    const elemStyle = window.getComputedStyle(memeTextsDiv.current.querySelector(".memeText"));
    const fontFamily = elemStyle.fontFamily;
    const fontSize = parseFloat(elemStyle.fontSize.slice(0, -2));
    ctx.textBaseline = "top";
    const areasRatio = Math.sqrt((canvasCopy.height * canvasCopy.width) / (imageRef.current.width * imageRef.current.height));
    const calcFontSize = areasRatio * fontSize;
    ctx.font = `${calcFontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor.value;
    ctx.strokeStyle = outlineColor.value;
    ctx.lineWidth = "1.2";
    memeTexts.value.forEach((memeText) => {
      const xRatio = memeText.xPos / imageRef.current.width;
      const yRatio = memeText.yPos / imageRef.current.height;
      let xPos = xRatio * canvasCopy.width;
      let yPos = yRatio * canvasCopy.height;
      memeText.text && memeText.text.split("\n").forEach((textLine) => {
        ctx.fillText(textLine, xPos, yPos);
        ctx.strokeText(textLine, xPos, yPos);
        yPos += calcFontSize;
      });
    })
    canvasCopy.isUpdated = true;
    const memeLink = canvasRef.current.toDataURL('image/png', 1.0);
    canvasRef.current.urlLink = memeLink;
    setMemeField("memeImage", memeLink);
  }

  //Triggers when user clicks the delete button. This action needs to be confirmed by the user.
  const onDeleteMeme = () => {
    if (confirm("The meme will be permanently deleted. Continue?")) {
      deleteMeme();
    }
  }

  const checkMemeChange = (fieldName, value) => {
    if (value instanceof Array) {
      if (compareArrays(value, initialMemeData.current[fieldName].value)) {
        changedFields.current.pop(fieldName);
        setMemeDataChanged(changedFields.current.length > 0);
      }
      else {
        if (!changedFields.current.includes(fieldName))
          changedFields.current.push(fieldName);
        setMemeDataChanged(true);
      }
    }
    else if (value == initialMemeData.current[fieldName].value) {
      changedFields.current.pop(fieldName);
      setMemeDataChanged(changedFields.current.length > 0);
    }
    else {
      if (!changedFields.current.includes(fieldName))
        changedFields.current.push(fieldName);
      setMemeDataChanged(true);
    }
  }

  /**
   * creates a style object with the with the x and y positions and font size.
   * @param  x - x position of the text
   * @param  y - y position of the text
   * @returns object with the x and y positions and font size propeties.
   */
  const getMemeTextStyle = ((x, y) => {
    let memeTextStyle = { left: x, top: y };
    if (memeData.textSize.value > 0)
      memeTextStyle["fontSize"] = memeData.textSize.value;
    return memeTextStyle;
  })

  return (
    memeData.hasOwnProperty("memeId") && <div id="createMemecontainer" className="container">
      <div>
        <Prompt when={isEditing && memeDataChanged}
          message={location => !location.pathname.includes("/meme/") &&
            `Are you sure you want to go to ${location.pathname}? Your data on this page won't be saved`
          } />
        {loading && <Loading />}
        <div className="row">
          <div className="col m12 l8">
            <div ref={memeTextsDiv} id="meme-preview" style={{ color: memeData.textColor.value, WebkitTextStroke: `${memeData.outlineColor.value} 2.5px` }}>
              <img src={memeData.memeOriginImage.value} crossOrigin="anonymous" ref={imageRef} onLoad={imageOnLoad} />
              {
                memeData.memeTexts && memeData.memeTexts.value.map((memeText, index) => {
                  return (
                    <div id={index + 1} key={index} style={getMemeTextStyle(memeText.xPos, memeText.yPos)} className={`memeText ${isEditing && " draggable"}`}>
                      {memeText.text && memeText.text.split("\n").map((textLine, index) => <React.Fragment key={index}>{textLine} <br /></React.Fragment>)}
                    </div>
                  )
                })
              }
            </div>
            <div id="memeSideButtons">
              <button type="button" className="btn" title="Download meme" onClick={downloadMeme}><i className="material-icons">file_download</i></button>
              {(currentUser?.userId && memeData?.memeId != -1 && currentUser?.userId === memeData?.userId) && <button type="submit" className="btn" title="Delete meme" ref={saveBtn} onClick={onDeleteMeme}>
                <i className="material-icons">delete</i></button>}
            </div>
            {(memeData?.memeId != -1 && currentUser?.userId != memeData?.userId) && <p>Created by <Link to={"/user/" + memeData.userId}>{memeData.userDisplayName}</Link></p>}
          </div>
          <div className="col m12 l4">
            {memeData.memeId.value !== -1 && !isEditing ?
              <MemeView setIsEditing={setIsEditing} memeTitle={memeData.memeTitle.value} created_at={memeData.created_at} updated_at={memeData.updated_at} isMemeOwner={isMemeOwner} upvoteMeme={upvoteMeme} upvoteId={upvotesList ? upvotesList.find((upvote) => upvote.memeId == memeData.memeId)?.upvoteId : -1} deleteUpvote={deleteUpvote} memeUpvotes={memeData.upvotes} isLoggedIn={currentUser.hasOwnProperty("userId")} /> :
              <MemeEditingForm memeData={memeData} setMemeField={setMemeField} saveMeme={saveMeme} drawMeme={drawMeme} defaultFontSize={defaultFontSize.current} canvasRef={canvasRef} errors={errors} setErrors={setErrors} checkMemeChange={checkMemeChange} isMemeOwner={isMemeOwner} makeMemeCopy={makeMemeCopy} />
            }
          </div>
          <MemeImageModal setMemeField={setMemeField} onLoad={imageOnLoad} />
          {/*  Modal Structure  */}

        </div>
      </div>
    </div >
  );
}

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  let iw = img.naturalWidth,
    ih = img.naturalHeight,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,   // new prop. width
    nh = ih * r,   // new prop. height
    cx, cy, cw, ch, ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

export default MemePage;