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


  const calculateWPM = (text) => {
    const wordsTyped = text.trim().split(/\s+/).length;
    const minutes = timeElapsed / 60;
    return wordsTyped / minutes || 0;
  };