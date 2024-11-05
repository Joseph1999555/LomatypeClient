// KeySound.js
import React, { useState, useEffect } from 'react';
import sound1 from '../assets/keyboard01.mp3';
import sound2 from '../assets/keyboard02.mp3';
import sound3 from '../assets/keyboard03.mp3';

const KeySound = () => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);

  // Array ของเสียงที่เราจะสลับไปมา
  const sounds = [sound1, sound2, sound3];

  useEffect(() => {
    const playSound = () => {
      if (isSoundOn) {
        const audio = new Audio(sounds[currentSoundIndex]);
        audio.play();

        // สลับไปยังเสียงถัดไป
        setCurrentSoundIndex((prevIndex) => (prevIndex + 1) % sounds.length);
      }
    };

    const handleKeyDown = () => {
      playSound();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSoundOn, currentSoundIndex, sounds]);

  // Toggle เปิด/ปิดเสียง
  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  return (
    <div style={styles.container}>
      <button onClick={toggleSound} style={styles.button}>
        {isSoundOn ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

// กำหนด CSS styles สำหรับ component
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px',
  },
  button: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default KeySound;
