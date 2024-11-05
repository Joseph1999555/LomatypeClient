import React, { useState, useEffect } from 'react';

const KeyboardSimulator = () => {
    const [activeKey, setActiveKey] = useState('');
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [typedKeys, setTypedKeys] = useState([]);

    const colorGroups = {
        red: ['Tab', 'CapsLock', 'LShift', 'LCtrl', 'LAlt', 'q', 'a', 'z', '`', '1'],
        orange: ['w', 's', 'x', '2'],
        yellow: ['e', 'd', 'c', '3'],
        green: ['r', 'f', 'v', 't', 'g', 'b', '4', '5'],
        blue: ['y', 'h', 'n', 'u', 'j', 'm', '6', '7'],
        gray: ['i', 'k', ',', '8'],
        brown: ['o', 'l', '.', '9'],
        purple: ['p', ';', '/', '[', ']', '\'', '\\', '0', '-', '=', 'Enter', 'Backspace', 'RAlt', 'RCtrl', 'RShift'],
        pink: ['Space']
    };

    const rows = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
        ['LShift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'RShift'],
        ['LCtrl', 'LAlt', 'Space', 'RAlt', 'RCtrl']
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            let key = e.key;

            if (key === 'Shift') {
                setIsShiftPressed(true);
            }

            if (key === ' ') key = 'Space';
            if (key === 'Enter') key = 'Enter';
            if (key === 'Backspace') key = 'Backspace';

            if (isShiftPressed && key.length === 1 && key.match(/[a-z]/i)) {
                key = key.toUpperCase();
            }

            setActiveKey(key);
            setTypedKeys((prev) => [...prev, key]);
        };

        const handleKeyUp = (e) => {
            let key = e.key;

            if (key === 'Shift') {
                setIsShiftPressed(false);
            }

            setActiveKey('');
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isShiftPressed]);

    const renderKey = (key) => {
        let displayKey = key;
        if (isShiftPressed && key.length === 1 && key.match(/[a-z]/i)) {
            displayKey = key.toUpperCase();
        }

        let className = `key ${activeKey === key ? 'active' : ''}`;
        if (typedKeys.includes(key)) {
            className += ' typed';
        }

        let groupClass = '';
        for (const group in colorGroups) {
            if (colorGroups[group].includes(key)) {
                groupClass = group;
                break;
            }
        }

        return (
            <button
                key={key}
                className={`${className} ${groupClass}`}
                style={key === 'Space' ? { flexGrow: 4 } : {}}
                aria-label={displayKey}
            >
                {displayKey}
            </button>
        );
    };

    return (
        <div className="keyboard-simulator">
    <div className="finger-info">
        <div className="left-hand">
            <h4>Left Hand</h4>
            <ul>
                <li><span className="pink">Thumb</span> - <span className="pink">Pink</span></li>
                <li><span className="green">Index</span> - <span className="green">Green</span></li>
                <li><span className="yellow">Middle</span> - <span className="yellow">Yellow</span></li>
                <li><span className="orange">Ring</span> - <span className="orange">Orange</span></li>
                <li><span className="red">Little</span> - <span className="red">Red</span></li>
            </ul>
        </div>
        <div className="right-hand">
            <h4>Right Hand</h4>
            <ul>
                <li><span className="pink">Thumb</span> - <span className="pink">Pink</span></li>
                <li><span className="blue">Index</span> - <span className="blue">Blue</span></li>
                <li><span className="gray">Middle</span> - <span className="gray">Gray</span></li>
                <li><span className="brown">Ring</span> - <span className="brown">Brown</span></li>
                <li><span className="purple">Little</span> - <span className="purple">Purple</span></li>
            </ul>
        </div>
    </div>

    {rows.map((row, rowIndex) => (
        <div className="key-row" key={rowIndex}>
            {row.map((key) => renderKey(key))}
        </div>
    ))}

    <style>{`
        .keyboard-simulator {
            display: flex;
            flex-direction: column;
            margin-top: 20px;
            max-width: 100%;
            align-items: center;
        }

        .finger-info {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            font-size: 16px;
            fromt-weight: bold;
        }

        .left-hand, .right-hand {
            flex: 1;
            text-align: center;
        }

        .left-hand ul, .right-hand ul {
            list-style: none; /* เอารูปกลมๆออก */
            padding: 0;
        }

        .key-row {
            display: flex;
            justify-content: center;
            margin-bottom: 5px;
        }

        .key {
            padding: 10px 20px;
            margin: 2px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            font-size: 16px;
            color: black; /* กำหนดสีเริ่มต้นของตัวอักษร */
        }

        .key.active {
            background-color: #ffe066;
        }

        .key.typed {
            background-color: #66ff66;
        }

        /* เพิ่มสีข้อความตามกลุ่มสี */
        .pink { color: #ffccff; }
        .green { color: #66ff66; }
        .yellow { color: #ffff66; }
        .orange { color: #ff9966; }
        .red { color: #ff6666; }
        .blue { color: #66b3ff; }
        .gray { color: #b3b3b3; }
        .brown { color: #996633; }
        .purple { color: #cc99ff; }

        /* เปลี่ยนสีตัวอักษรให้เหมาะสมกับสีพื้นหลังของปุ่ม */
        .key.red { background-color: #ff6666; color: black; }
        .key.orange { background-color: #ff9966; color: black; }
        .key.yellow { background-color: #ffff66; color: black; }
        .key.green { background-color: #66ff66; color: black; }
        .key.blue { background-color: #66b3ff; color: black; }
        .key.gray { background-color: #b3b3b3; color: black; }
        .key.brown { background-color: #996633; color: black; }
        .key.purple { background-color: #cc99ff; color: black; }
        .key.pink { background-color: #ffccff; color: black; }

        .key:hover {
            background-color: #e0e0e0;
        }

        .key:active {
            background-color: #b0d0ff;
        }

        .key[style*="flexGrow"] {
            flex-grow: 4;
            text-align: center;
        }

        .key-row:nth-child(1) .key {
            flex-grow: 1;
        }

        .key-row:nth-child(2) .key:last-child {
            flex-grow: 2;
        }

        .key-row:nth-child(3) .key:first-child {
            flex-grow: 1.5;
        }

        .key-row:nth-child(4) .key:first-child {
            flex-grow: 1.5;
        }

        .key-row:nth-child(4) .key:last-child {
            flex-grow: 2;
        }

        .key-row:nth-child(5) .key:first-child,
        .key-row:nth-child(5) .key:last-child {
            flex-grow: 2;
        }
    `}</style>
</div>


    );
};

export default KeyboardSimulator;
