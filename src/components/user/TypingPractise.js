import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Sidebar from '../sidebar';
import Header from '../header';
import KeySound from '../KeySound';
import KeyboardSimulator from '../Keyboard';

const TypingPractice = ({ selectedLanguage, selectedType, setSelectedLanguage, setSelectedType, selectedDifficulty, setSelectedDifficulty }) => {
  const [snippet, setSnippet] = useState('');
  const [snippetId, setSnippetId] = useState(''); // State to hold the snippet ID
  const [result, setResult] = useState('');
  const [difficulties, setDifficulties] = useState([]);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // Changed to count up
  const [timerInterval, setTimerInterval] = useState(null); // To hold the interval ID
  const [timerEnabled, setTimerEnabled] = useState(true); // เพิ่ม state สำหรับการเปิด/ปิดการจับเวลา
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [typingErrors, setTypingErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [formattedResult, setFormattedResult] = useState(''); // State for formatted text comparison
  const [statsSaved, setStatsSaved] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const fetchSnippet = async (language, type, difficulty) => {
    if (!language || !type || !difficulty) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://lomatypeserver.onrender.com/user/fetch/snippet2?language=${language._id}&type=${type._id}&difficulty=${difficulty._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnippet(response.data.snippet_text);
      setResult(response.data.result);
      setSnippetId(response.data._id);
      setInputText(''); // ล้าง inputText
      setTimeElapsed(0); // รีเซ็ตเวลา
      setTimeLeft(30); // รีเซ็ตเวลานับถอยหลัง
      setTimerStarted(false); // รีเซ็ตการจับเวลา

      console.log('Snippet fetched:', snippet);
      console.log('respose:', response.data);

      if (timerInterval) {
        clearInterval(timerInterval); // หยุดตัวจับเวลาเก่า
        setTimerInterval(null); // ล้างค่า interval ID
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลโค้ด:', error);
    }
  };

  const fetchDifficulties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://lomatypeserver.onrender.com/user/fetch/difficulties', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setDifficulties(response.data);
    } catch (error) {
      console.error('Error fetching difficulties:', error);
    }
  };

  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto'; // รีเซ็ตความสูงก่อน
      textarea.style.height = textarea.scrollHeight + 'px'; // ปรับขนาดตามเนื้อหาภายใน
    }
  };

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    autoResizeTextarea(textarea); // ปรับขนาด textarea เมื่อข้อความถูก fetch มา
  }, [snippet]); // ดักฟังการเปลี่ยนแปลงของ snippet


  useEffect(() => {
    fetchDifficulties(); // Fetch difficulties when component mounts
  }, []);

  const calculateWPM = (text) => {
    const wordsTyped = text.trim().split(/\s+/).length;
    const minutes = (timeElapsed / 2) / 60;
    return wordsTyped / minutes || 0;
  };

  useEffect(() => {
    if (timerEnabled && timeLeft > 0 && timerStarted) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      calculateStats();
      saveStats();
    }
  }, [timeLeft, timerStarted, timerEnabled]);

  useEffect(() => {
    let interval;
    if (timerStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval); // ล้างตัวจับเวลาเมื่อ component ถูกทำลาย
  }, [timerStarted]);

  useEffect(() => {
    if (inputText === snippet && timeLeft > 0) {
      clearInterval(timerInterval);
      fetchSnippet();
    }
  }, [inputText]);

  const calculateAccuracyAndErrors = (typedText, originalSnippet) => {
    let correctChars = 0;
    let errorCount = 0;
    const minLength = Math.min(typedText.length, originalSnippet.length);

    for (let i = 0; i < minLength; i++) {
      if (typedText[i] === originalSnippet[i]) {
        correctChars++;
      } else {
        errorCount++;
      }
    }

    // Add remaining characters as errors if typedText is longer than snippet
    if (typedText.length > originalSnippet.length) {
      errorCount += typedText.length - originalSnippet.length;
    }

    const accuracy = ((correctChars / originalSnippet.length) * 100).toFixed(2);

    setTypingErrors(errorCount); // Update typing errors state
    return accuracy;
  };


  const formatResult = (typedText, originalSnippet) => {
    let result = '';
    for (let i = 0; i < originalSnippet.length; i++) {
      if (typedText[i] === originalSnippet[i]) {
        result += `<span style="color:green;">${originalSnippet[i] === ' ' ? '&nbsp;' : originalSnippet[i]}</span>`;
      } else if (typedText[i] !== undefined) {
        result += `<span style="color:red; text-decoration: underline;">${originalSnippet[i] === ' ' ? '&nbsp;' : originalSnippet[i]}</span>`;
      } else {
        result += `<span>${originalSnippet[i] === ' ' ? '&nbsp;' : originalSnippet[i]}</span>`;
      }
    }
    return result;
  };

  const calculateStats = () => {
    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000; // เวลาที่ใช้
    console.log('Time Spent:', timeSpent);
    const wordsTyped = inputText.trim().split(/\s+/).length; // จำนวนคำที่พิมพ์
    const grossWpm = (wordsTyped / (timeSpent / 60)) || 0; // WPM คำนวณจากคำที่พิมพ์ / นาที
    console.log('Words Typed:', wordsTyped);
    console.log('Gross WPM:', grossWpm);
    const correctChars = inputText.split('').filter((char, index) => char === snippet[index]).length;
    const accuracyRate = (snippet.length > 0 ? (correctChars / snippet.length) * 100 : 0); // คำนวณความแม่นยำ
    console.log('Correct Chars:', correctChars);
    console.log('Accuracy Rate:', accuracyRate);

    setWpm(grossWpm.toFixed(2));
    setAccuracy(accuracyRate.toFixed(2));
  };

  const handleInputChange = (e) => {
    if (!timerStarted) {
      setTimerStarted(true);
      setStartTime(Date.now()); // ตั้งเวลาเริ่มต้น
    }

    const typedText = e.target.value;
    setInputText(typedText);
    autoResizeTextarea();

    // Calculate WPM and accuracy and errors
    setWpm(calculateWPM(typedText).toFixed(2));
    const accuracy = calculateAccuracyAndErrors(typedText, snippet);
    setAccuracy(accuracy);

    // Format and display result
    const formatted = formatResult(typedText, snippet);
    setFormattedResult(formatted);

    // Start timer if it's not already started
    if (!timerInterval) {
      const interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      setTimerInterval(interval);
    }

    // Stop timer and navigate to result page when text matches snippet
    if (typedText === snippet) {
      clearInterval(timerInterval); // หยุดนับเวลาเมื่อพิมพ์เสร็จ
      saveStats();
    }
  };

  const compareText = () => {
    return snippet.split('').map((char, index) => {
      const inputChar = inputText[index];
      if (inputChar === char) {
        return <span key={index} className="correct">{char === ' ' ? <span>&nbsp;</span> : char}</span>;
      } else if (inputChar === undefined) {
        return <span key={index} className="placeholder">{char === ' ' ? <span>&nbsp;</span> : char}</span>;
      } else {
        return <span key={index} className="incorrect" style={{ textDecoration: 'underline', color: 'red' }}>{char === ' ' ? <span>&nbsp;</span> : char}</span>;
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);

      setInputText(newValue);
      e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
    }
  };

  const saveStats = async () => {
    const token = localStorage.getItem('token');
    let userId = null;
    console.log('Token:', token);

    try {

      if (token) {
        try {
          const decodedToken = jwtDecode(token); // Decode JWT token
          console.log('Decoded Token:', decodedToken); // Log decoded token for debugging
          userId = decodedToken.id; // Extract userId from the token
          if (!userId) {
            throw new Error('User ID is missing in the token');
          }
        } catch (error) {
          console.error('Invalid token', error);
          return;
        }
      } else {
        console.error('Token is not available in localStorage');
        return;
      }

      if (!userId) {
        console.error('User is not authenticated');
        return;
      }

      const response = await axios.post('https://lomatypeserver.onrender.com/user/create/typingstat', {
        user_id: userId,
        code_snippet_id: snippetId,
        typing_speed: wpm,           // WPM ที่คำนวณจากการพิมพ์
        typing_accuracy: accuracy,   // ความแม่นยำที่คำนวณ
        typing_errors: typingErrors, // จำนวนข้อผิดพลาดในการพิมพ์
        typing_time: timeElapsed / 2,    // เวลาในการพิมพ์
        module_id: selectedType.module_id,  // module ที่เลือก
        type_id: selectedType._id,          // type ที่เลือก
        difficult_id: selectedDifficulty._id, // difficulty ที่เลือก
        language_id: selectedLanguage._id, // language ที่เลือก
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // ส่ง token ไปยืนยัน
        },
      });

      console.log('สถิติการพิมพ์ถูกบันทึกเรียบร้อย:', response.data);
      navigate('/TrainingResults');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกสถิติการพิมพ์:', error);
      console.log('Error:', error.response.data);
    }
  };

  useEffect(() => {
    // Load snippet when either selectedLanguage or selectedType changes
    if (selectedLanguage && selectedType && selectedDifficulty) {
      fetchSnippet(selectedLanguage, selectedType, selectedDifficulty);
      setStartTime(Date.now());
      console.log(' selectedType:', selectedType);
    }
  }, [selectedLanguage, selectedType, selectedDifficulty]);

  return (
    <div className="typing-practice-container" >
      <Header />
      <Sidebar
        selectedLanguage={selectedLanguage}
        selectedType={selectedType}
        onLanguageSelect={setSelectedLanguage}
        onTypeSelect={setSelectedType}
      />

      <div className="typing-practice">
        {/* <button className="logout-button" onClick={handleLogout}>Logout</button> */}
        <h1>Typing Practice</h1>
        <KeySound />
        <div className="control-container">
          <select
            className="custom-select"
            value={selectedDifficulty ? selectedDifficulty._id : ''}
            onChange={(e) => {
              const selected = difficulties.find(difficulty => difficulty._id === e.target.value);
              setSelectedDifficulty(selected);
            }}
          >
            <option value="">select</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty._id} value={difficulty._id}>
                {difficulty.difficult_level}
              </option>
            ))}
          </select>

          {timerEnabled && <div className="timer">⏱ {timeLeft} s</div>}


          <label >
            <div className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox"
                checked={timerEnabled}
                onChange={() => setTimerEnabled(!timerEnabled)}
                id="timerToggle"
              />
              <label htmlFor="timerToggle">Enable Timer</label>
            </div>

          </label>

        </div>

        <div className="typing-area">
          <div className="textarea-container">
            <textarea
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              placeholder={snippet}
            />
            <div className="formatted-text">
              {compareText()}
            </div>

          </div>
        </div>
        <h2>ผลลัพธ์</h2>
        <div className="snippet">{result}</div>
        {/* <Chatbot /> */}
        {/* <KeyboardSimulator /> */}
      </div>
      <style>
        {`

          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            
            
          }

    .typing-practice-container {
  display: flex;
  height: 100%; 
  justify-content: flex-start;
}


.typing-practice {
  flex-grow: 1;
  padding: 20px;
  position: relative;
  margin-top: 30px;
}

.snippet-container {
  position: relative;
  margin-bottom: 20px;
  height: auto; /* ปรับให้ความสูงเท่ากันกับเนื้อหาข้อความ */
}

.snippet, .formatted-result {
  font-family: monospace;
  padding: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 16px; /* ให้ฟอนต์เท่ากัน */
  line-height: 1.5; /* ให้เว้นบรรทัดเท่ากัน */
}

.snippet {
  background-color: transparent;
  border: 1px solid Darkblue;
  z-index: 1;
}

.correct {
  color: #1dc21a;
  font-weight: bold;
}

.incorrect {
  color: red;
  font-weight: bold;
}

.placeholder {
  color: #514a48;
  font-weight: bold;
}

textarea::selection {
  background: rgba(0, 0, 0, 0.1); /* Highlight selected text */
}

.timer {
margin-left: 1300px;
margin-right: 00px;
  font-size: 15px;
  font-weight: nomal;
}

.control-container {
  display: flex;
  align-items: center; /* จัดแนวให้ตรงกลางในแนวตั้ง */
  justify-content: space-between; /* ให้เว้นระยะห่างระหว่างองค์ประกอบ */
  margin-bottom: 20px; /* ระยะห่างจากด้านล่าง */
}

.control-container select {
  margin-right: 10px; /* ระยะห่างขวาจาก dropdown */
}

.textarea-container {
    position: relative;
    width: 100%;
}

.typing-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.typing-area textarea {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 300px;
    padding: 10px;
    font-family: monospace;
    font-size: 1.2em;
    background-color: transparent;
    border: 1px solid Darkblue;
    border-radius: 5px;
    box-sizing: border-box;
    resize: none;
    line-height: 1.5;
}

.typing-area textarea::placeholder {
    color: transparent;
}

.typing-area textarea::before {
    content: attr(data-snippet);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
    font-family: monospace;
    font-size: 1.2em;
    color: rgba(0, 0, 0, 0.1);
    background-color: transparent;
    border-radius: 5px;
    white-space: pre-wrap;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
}

.background-text {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    font-family: monospace;
    font-size: 1.2em;
    color: rgba(0, 0, 0, 0.3);
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    pointer-events: none;
    z-index: 1;
}

textarea {
    width: 100%;
    height: 200px;
    font-family: monospace;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
    color: transparent;
    caret-color: black;
    background-color: #BF7AA0;
    position: absolute;
    z-index: 2;
}

.formatted-text {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    font-family: monospace;
    font-size: 1.2em;
    line-height: 1.5;
    color: black;
    pointer-events: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    z-index: 1;
}

.custom-select {
  width: 100px;
  padding: 10px;
  border: 1px solid darkblue;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
  appearance: none; /* Remove default arrow */
  background-image: url('https://img.icons8.com/ios-filled/50/000000/expand-arrow--v1.png');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.custom-select:focus {
  outline: none;
  border-color: #03738C;
}

.custom-select option {
  padding: 10px;
  color: #333;
  background-color: #fff;
}

/* Adjust for smaller screens */
@media (max-width: 600px) {
  .custom-select {
    font-size: 14px;
  }
}
    .checkbox-container {
      display: flex;
      align-items: center;
    }

    .checkbox {
      appearance: none; /* Remove default checkbox styling */
      width: 20px;
      height: 20px;
      border: 1.5px solid Darkblue;
      border-radius: 4px;
      outline: none;
      cursor: pointer;
      margin-right: 10px;
      position: relative;
      background-color: white;
      transition: background-color 0.3s, border-color 0.3s;
    }

    .checkbox:checked {
      background-color: #03738C; /* Change background when checked */
      border-color: Darkblue;
    }

    .checkbox:checked::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 5px;
      width: 6px;
      height: 12px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    label {
      font-size: 16px; /* Customize label font size */
      cursor: pointer; /* Make label clickable */
    }

  `}
      </style>
    </div>
  );
};

export default TypingPractice;