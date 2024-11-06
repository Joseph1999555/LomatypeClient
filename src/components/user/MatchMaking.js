import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Header from '../header';

const MatchMaking = () => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [isMatching, setIsMatching] = useState(false);
	const [matchFound, setMatchFound] = useState(false);
	const [opponent, setOpponent] = useState(null);
	const [opponentName, setOpponentName] = useState('');
	const [error, setError] = useState(null);
	const [codeSnippet, setCodeSnippet] = useState('');
	const [player1Input, setPlayer1Input] = useState('');
	const [player2Input, setPlayer2Input] = useState('');
	const [player1Stats, setPlayer1Stats] = useState({ wpm: 0, accuracy: 0 });
	const [player2Stats, setPlayer2Stats] = useState({ wpm: 0, accuracy: 0 });
	const [startTime, setStartTime] = useState(null);
	const [ws, setWs] = useState(null);
	const [isPlayerReady, setIsPlayerReady] = useState(false);
	const [opponentReady, setOpponentReady] = useState(false);
	const [bothPlayersReady, setBothPlayersReady] = useState(false);
	const [inputText, setInputText] = useState('');
	const [countdown, setCountdown] = useState(6000); // 60-second timer
	const [matchEnded, setMatchEnded] = useState(false);
	const jwtToken = localStorage.getItem('token');
	const user = jwtToken ? jwtDecode(jwtToken) : null;
	const textareaRef = useRef(null); // ใช้ ref สำหรับ textarea
	const [showModal, setShowModal] = useState(false);
	const [matchResult, setMatchResult] = useState('');
	// สร้างตัวแปรเพื่อเก็บสถิติจาก WebSocket
	const [finalPlayer1Stats, setFinalPlayer1Stats] = useState({ wpm: 0, accuracy: 0 });
	const [finalPlayer2Stats, setFinalPlayer2Stats] = useState({ wpm: 0, accuracy: 0 });

	const countdownStyle = {
		fontSize: '2rem',
		fontWeight: 'bold',
		color: countdown <= 10 ? 'red' : 'black', // Turns red when 10 seconds or less
	};

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);

	const fetchUserData = async () => {
		try {
			const response = await axios.get(`https://lomatypeserver.onrender.com/user/fetch/user/${user.id}`, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			});
			setUserData(response.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	useEffect(() => {
		fetchUserData();
		const socket = new WebSocket('wss://lomatypeserver.onrender.com');

		socket.onopen = () => {
			console.log('WebSocket connected');
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Received message:', data);
			if (data.event === 'match_found') {
				setMatchFound(true);
				setOpponent(data.data);
				setOpponentName(data.data.name);
				setCodeSnippet(data.data.codeSnippet);
				const textarea = document.querySelector('textarea');
				autoResizeTextarea(textarea); // ปรับขนาด textarea ทันทีที่ตั้งค่า snippet
				console.log('Match found:', data.data.codeSnippet);
			} else if (data.event === 'opponent_ready') {
				setOpponentReady(true);
			} else if (data.event === 'typing_update') {
				// ตรวจสอบว่า playerId ของผู้ส่งไม่ใช่ id ของผู้เล่นเอง
				if (data.playerId !== user.id) {
					// อัปเดตการพิมพ์ของคู่แข่ง
					setPlayer2Input(data.input);
					console.log('Player 2 typing:', data.input);
				}
			}
			if (data.event === 'update_final_stats') {
				// แยกเก็บค่าตาม userId ที่ได้รับ
				if (data.userId === user.id) {
					setFinalPlayer1Stats({ wpm: data.wpm, accuracy: data.accuracy });
					console.log("Updated Final Player 1 Stats:", { wpm: data.wpm, accuracy: data.accuracy });
				} else {
					setFinalPlayer2Stats({ wpm: data.wpm, accuracy: data.accuracy });
					console.log("Updated Final Player 2 Stats:", { wpm: data.wpm, accuracy: data.accuracy });
				}
			}
		};


		setWs(socket);

		return () => {
			socket.close();
		};
	}, []);

	useEffect(() => {
		if (isPlayerReady && opponentReady) {
			setBothPlayersReady(true);
		}
	}, [isPlayerReady, opponentReady]);

	// Countdown timer effect
	useEffect(() => {
		if (bothPlayersReady && countdown > 0 && !matchEnded) {
			const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
			return () => clearInterval(timer);
		} else if (countdown === 0 && !matchEnded) {
			endMatch();
		}
	}, [countdown, bothPlayersReady, matchEnded]);

	useEffect(() => {
		if (matchEnded) {
			console.log("Match ended stats:", finalPlayer1Stats, finalPlayer2Stats);
		}
	}, [matchEnded, finalPlayer1Stats, finalPlayer2Stats]);


	const endMatch = () => {
		setMatchEnded(true);

		// ตรวจสอบค่า finalPlayer1Stats และ finalPlayer2Stats
		console.log("Final Player 1 Stats:", finalPlayer1Stats);
		console.log("Final Player 2 Stats:", finalPlayer2Stats);
		console.log("userData:", userData._id);

		const player1Score = finalPlayer1Stats.wpm * (finalPlayer1Stats.accuracy / 100);
		const player2Score = finalPlayer2Stats.wpm * (finalPlayer2Stats.accuracy / 100);
		let winner;

		if (player1Score > player2Score) {
			winner = `${userData.username} wins!`;
		} else if (player2Score > player1Score) {
			winner = `${opponentName} wins!`;
		} else {
			winner = 'It\'s a tie!';
		}

		setMatchResult(`Game Over! ${winner}`);
		setShowModal(true); // Show modal with match result

		// ส่งสถิติการแข่งขันไปยัง WebSocket server
		if (ws) {
			ws.send(JSON.stringify({
				event: 'match_end',
				data: {
					player1: {
						username: userData.username,
						wpm: finalPlayer1Stats.wpm,
						accuracy: finalPlayer1Stats.accuracy,
					},
					player2: {
						username: opponentName,
						wpm: finalPlayer2Stats.wpm,
						accuracy: finalPlayer2Stats.accuracy,
					},
					winner: winner,
				},
			}));
		}
	};


	const closeModal = () => {
		setShowModal(false);
		window.location.reload(); // Refresh the page when the modal is closed
	};

	const startMatching = () => {
		setIsMatching(true);
		setError(null);
		if (ws) {
			ws.send(JSON.stringify({ event: 'request_match', userId: user.id, username: userData.username }));
		}
	};

	const handleReady = () => {
		setIsPlayerReady(true);
		if (ws) {
			ws.send(JSON.stringify({ event: 'player_ready', userId: user.id }));
		}
	};

	const snippet = codeSnippet ? codeSnippet.snippet_text : '';


	const handleTyping = (e) => {
		const input = e.target.value;
		setPlayer1Input(input);
		autoResizeTextarea(); // ปรับขนาดทุกครั้งที่มีการพิมพ์

		if (!startTime) {
			setStartTime(Date.now()); // กำหนด startTime เมื่อเริ่มพิมพ์
		}

		const stats = calculateStats(input); // ส่งเฉพาะ input
		if (stats) {
			setPlayer1Stats(stats); // Update player 1 stats
			// Send the updated stats to the WebSocket
			if (ws) {
				ws.send(JSON.stringify({
					event: 'player_stats_update',
					id: userData.id,
					stats: stats,
				}));
			}
		}

		ws.send(JSON.stringify({
			type: "typing",
			userId: userData.id,
			input: input,
		}));
	};


	const handleKeyDown = (e) => {
		if (e.key === 'Tab') {
			e.preventDefault();
			const { selectionStart, selectionEnd } = e.target;
			const value = e.target.value;
	
			// แทรก tab ที่ตำแหน่ง cursor
			const newValue = `${value.substring(0, selectionStart)}\t${value.substring(selectionEnd)}`;
			e.target.value = newValue;
	
			// เลื่อนไปข้างหน้าเพื่อให้ cursor อยู่หลัง tab ที่เพิ่มเข้ามา
			e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
			
			// อัปเดต state ของข้อความที่กรอก
			setPlayer1Input(newValue);
		}
	};
	

	const compareText = (inputText) => {
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

	const autoResizeTextarea = (textarea) => {
		if (textarea) {
			textarea.style.height = 'auto'; // รีเซ็ตความสูงก่อน
			textarea.style.height = `${textarea.scrollHeight}px`; // ปรับขนาดตามเนื้อหาภายใน
		}
	};

	const calculateStats = (input) => {
		if (!snippet) return; // ตรวจสอบว่าสิ่งนี้มีค่าก่อนคำนวณ
		const words = input.trim().split(' ').length;
		const elapsedTime = (Date.now() - startTime) / 60000; // คำนวณเวลาโดยใช้ startTime
		const wpm = Math.round(words / elapsedTime);
		const correctChars = input.split('').filter((char, idx) => char === snippet[idx]).length;
		const accuracy = Math.round((correctChars / snippet.length) * 100);
		return { wpm, accuracy };
	};


	return (
		<div className="match-making-container">
			<Header />
			<div className="match-making">
				<h1>Match Making</h1>
				{!isMatching && !matchFound && (
					<button onClick={startMatching}>เริ่มการจับคู่</button>
				)}
				{isMatching && <p>กำลังค้นหาคู่แข่งขัน...</p>}
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</div>
			<div className="matchmaking">
				<h2>Typing Matchmaking</h2>
				{bothPlayersReady ? (
					<div className="code-snippet">
						{/* <pre>{snippet}</pre> */}
						<p style={countdownStyle}>Time Remaining: {countdown}s</p>
						<p>START</p>
					</div>
				) : (
					<div>
						<button onClick={handleReady} disabled={isPlayerReady}>พร้อม</button>
						{isPlayerReady && <p>รอคู่แข่งพร้อม...</p>}
					</div>
				)}
				<div className="players">
					<div className="typing-area">
						<h3>Player 1: {userData?.username || 'Loading...'}</h3>
						{bothPlayersReady ? (
							<div className="textarea-container">
								<textarea
									ref={textareaRef} // ใช้ ref สำหรับ textarea
									value={player1Input}
									onChange={(e) => handleTyping(e, 1)}
									onKeyDown={handleKeyDown}
									placeholder={snippet}
									spellCheck="false"
									disabled={!bothPlayersReady}
								></textarea>
								<div className="formatted-text">
									{compareText(player1Input)} {/* สำหรับ Player 1 */}
								</div>
							</div>
						) : (
							<div>
								{isPlayerReady && <p>รอคู่แข่งพร้อม...</p>}
							</div>
						)}
						{/* <p>WPM: {player1Stats.wpm}</p>
						<p>Accuracy: {player1Stats.accuracy}%</p> */}
					</div>

					<div className="typing-area">
						<h3>Player 2: {opponentName || 'Waiting for opponent...'}</h3>
						{bothPlayersReady ? (
							<div className="textarea-container">
								<textarea
									ref={textareaRef}
									value={player2Input}
									onChange={(e) => handleTyping(e, 2)}
									onKeyDown={handleKeyDown}
									placeholder={snippet}
									spellCheck="false"
									disabled={!bothPlayersReady}
								></textarea>
								<div className="formatted-text">
									{compareText(player2Input)} {/* สำหรับ Player 2 */}
								</div>
							</div>
						) : (
							<div>
								{isPlayerReady && <p>รอคู่แข่งพร้อม...</p>}
							</div>
						)}
						{/* <p>WPM: {player2Stats.wpm}</p>
						<p>Accuracy: {player2Stats.accuracy}%</p> */}
					</div>
				</div>
			</div>
			{/* Match End Modal */}
			{/* Match End Modal */}
			{showModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h2>{matchResult}</h2>
						<div className="stats">
							<p><strong>{userData?.username}</strong></p>
							<p>WPM: {finalPlayer1Stats.wpm}</p>
							<p>Accuracy: {finalPlayer1Stats.accuracy}%</p>
							<p><strong>{opponentName}</strong></p>
							<p>WPM: {finalPlayer2Stats.wpm}</p>
							<p>Accuracy: {finalPlayer2Stats.accuracy}%</p>
						</div>
						<button onClick={closeModal}>Close</button>
					</div>
				</div>
			)}

<style>{`
	.match-making-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		text-align: relative;
	}

	.match-making, .matchmaking {
		margin: 20px;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		width: 100%;
		max-width: 1200px;
		height: auto;
		max-height: 1200px;
	}

	.code-snippet {
		margin: 20px;
		padding: 10px;
		font-size: 1.2em;
		background-color: #f4f4f4;
		border-radius: 5px;
		overflow-x: auto;
	}

	.players {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		gap: 20px;
		width: auto;
	}

	.player {
		flex: 1;
		text-align: center;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 10px;
	}

	.typing-area {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		height: 100%;
	}

	.typing-area textarea {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 500px;
		padding: 10px;
		font-family: monospace;
		font-size: 1.2em;
		background-color: transparent;
		border: 1px solid Darkblue;
		border-radius: 5px;
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
		overflow: auto;
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

	.textarea-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	textarea {
		width: 100%;
		height: 100px;
		padding: 8px;
		resize: none;
		border-radius: 5px;
		border: 1px solid #ccc;
		font-size: 1em;
		background-color: #f9f9f9;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		font-family: 'Courier New', Courier, monospace;
		line-height: 1.5;
		color: transparent;
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

	button {
		margin-top: 10px;
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: #fff;
		cursor: pointer;
		font-size: 1em;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.modal-overlay {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.5);
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 1000;
				}
				.modal-content {
					background: white;
					padding: 20px;
					border-radius: 8px;
					width: 80%;
					max-width: 500px;
					text-align: center;
				}
				.modal-content h2 {
					font-size: 24px;
					margin-bottom: 15px;
				}
				.stats p {
					margin: 8px 0;
				}
				.modal-content button {
					margin-top: 15px;
					padding: 8px 16px;
					background-color: #007bff;
					color: white;
					border: none;
					border-radius: 4px;
					cursor: pointer;
				}
`}</style>


		</div>
	);
};

export default MatchMaking;
