import React, { useState, useEffect } from 'react';
import MemeItem from '../../components/memes/MemeItem';


function MemesSilider({ memes, setIsEditing }) {

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = memes.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, memes]);

  useEffect(() => {
    if (memes.length > 1) {
      let slider = setInterval(() => {
        setIndex(index + 1);
      }, 5000);
      return () => {
        clearInterval(slider);
      }
    };
  }, [index]);

  return (
    <div id='sliderContainer' className='container'>
      <h3>Top Memes</h3>
      {memes.map((meme, memeIndex) => {

        let position = 'nextSlide';
        if (memeIndex === index || memes.length === 1) {
          position = 'activeSlide';
        }
        else if (
          memeIndex === index - 1 ||
          (index === 0 && memeIndex === memes.length - 1)
        )
          position = 'lastSlide';


        return (
          <div key={memeIndex} className={`sliderDiv ${position}`}>
            <MemeItem setIsEditing={setIsEditing} meme={meme} />
          </div>
        );
      })
      }
      <button className='btn prev' onClick={() => setIndex(index - 1)}>
        <i className='material-icons'>chevron_left</i>
      </button>
      <button className='btn next' onClick={() => setIndex(index + 1)}>
        <i className='material-icons'>chevron_right</i>
      </button>
    </div>
  );
}

export default MemesSilider;
