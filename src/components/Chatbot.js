import React, { useEffect, useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "สวัสดีค่ะ ยินดีต้อนรับ! ถามอะไรฉันได้เลย", fromBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, fromBot: false }]);
    
    // Logic for bot's response
    const botResponse = getBotResponse(input);
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: botResponse, fromBot: true }]);
    }, 500);

    setInput('');
  };

  const getBotResponse = (input) => {
    // Simple responses
    if (input.toLowerCase().includes("หนังสือ")) {
      return "คุณสนใจหนังสือประเภทใดบ้าง?";
    } else if (input.toLowerCase().includes("ราคา")) {
      return "คุณสามารถเช็คราคาหนังสือได้จากหน้าเว็บ!";
    }
    return "ฉันไม่เข้าใจคำถามค่ะ ลองถามใหม่ได้นะคะ";
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', border: '1px solid #ccc', padding: '20px' }}>
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.fromBot ? 'left' : 'right', marginBottom: '10px' }}>
            <span style={{ backgroundColor: msg.fromBot ? '#f1f1f1' : '#007bff', color: msg.fromBot ? '#000' : '#fff', padding: '8px', borderRadius: '10px' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="พิมพ์ข้อความ..." 
        style={{ width: '80%', padding: '10px' }} 
      />
      <button onClick={handleSend} style={{ width: '20%', padding: '10px' }}>ส่ง</button>
    </div>
  );
};

export default Chatbot;
