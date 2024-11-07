<style>{`
	.match-making-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
	}

	.match-making, .matchmaking {
		margin: 20px 0;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		width: 100%;
		max-width: 800px;
		background-color: #f9f9f9;
	}

	.code-snippet {
		margin: 20px 0;
		padding: 10px;
		font-size: 1.2em;
		background-color: #e0e0e0;
		border-radius: 5px;
	}

	.players {
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
		gap: 20px;
	}

	.typing-area {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 45%;
	}

	.typing-area textarea {
		width: 100%;
		height: 200px;
		padding: 10px;
		font-family: monospace;
		font-size: 1em;
		background-color: #fff;
		border: 1px solid #007bff;
		border-radius: 5px;
		resize: none;
	}

	.formatted-text {
		position: absolute;
		top: 0;
		left: 0;
		padding: 10px;
		font-family: monospace;
		font-size: 1em;
		color: black;
		pointer-events: none;
	}

	button {
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: #fff;
		cursor: pointer;
		font-size: 1em;
		transition: background-color 0.3s;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	button:hover:not(:disabled) {
		background-color: #0056b3;
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
		font-size: 1.5em;
		margin-bottom: 15px;
	}

	.stats p {
		margin: 8px 0;
	}

	.modal-content button {
		margin-top: 15px;
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
`}</style>


////////////////////////

// <style>{`
// 	.match-making-container {
// 		display: flex;
// 		flex-direction: column;
// 		align-items: center;
// 		justify-content: center;
// 		padding: 20px;
// 		text-align: relative;
// 	}

// 	.match-making, .matchmaking {
// 		margin: 20px;
// 		padding: 20px;
// 		border: 1px solid #ddd;
// 		border-radius: 8px;
// 		width: 100%;
// 		max-width: 1200px;
// 		height: auto;
// 		max-height: 1200px;
// 	}

// 	.code-snippet {
// 		margin: 20px;
// 		padding: 10px;
// 		font-size: 1.2em;
// 		background-color: #f4f4f4;
// 		border-radius: 5px;
// 		overflow-x: auto;
// 	}

// 	.players {
// 		display: flex;
// 		justify-content: space-between;
// 		margin-top: 20px;
// 		gap: 20px;
// 		width: auto;
// 	}

// 	.player {
// 		flex: 1;
// 		text-align: center;
// 		border: 1px solid #ddd;
// 		border-radius: 8px;
// 		padding: 10px;
// 	}

// 	.typing-area {
// 		display: flex;
// 		flex-direction: column;
// 		gap: 10px;
// 		width: 100%;
// 		height: 100%;
// 	}

// 	.typing-area textarea {
// 		position: relative;
// 		z-index: 2;
// 		width: 100%;
// 		height: 500px;
// 		padding: 10px;
// 		font-family: monospace;
// 		font-size: 1.2em;
// 		background-color: transparent;
// 		border: 1px solid Darkblue;
// 		border-radius: 5px;
// 		resize: none;
// 		line-height: 1.5;
// 	}

// 	.typing-area textarea::placeholder {
// 		color: transparent;
// 	}

// 	.typing-area textarea::before {
// 		content: attr(data-snippet);
// 		position: absolute;
// 		top: 0;
// 		left: 0;
// 		width: 100%;
// 		height: 100%;
// 		padding: 10px;
// 		font-family: monospace;
// 		font-size: 1.2em;
// 		color: rgba(0, 0, 0, 0.1);
// 		background-color: transparent;
// 		border-radius: 5px;
// 		white-space: pre-wrap;
// 		overflow: auto;
// 		pointer-events: none;
// 		z-index: 1;
// 	}
		
// 	.background-text {
// 		position: absolute;
// 		top: 0;
// 		left: 0;
// 		padding: 10px;
// 		font-family: monospace;
// 		font-size: 1.2em;
// 		color: rgba(0, 0, 0, 0.3);
// 		line-height: 1.5;
// 		white-space: pre-wrap;
// 		word-wrap: break-word;
// 		pointer-events: none;
// 		z-index: 1;
// 	}

// 	.textarea-container {
// 		position: relative;
// 		width: 100%;
// 		height: 100%;
// 	}

// 	textarea {
// 		width: 100%;
// 		height: 100px;
// 		padding: 8px;
// 		resize: none;
// 		border-radius: 5px;
// 		border: 1px solid #ccc;
// 		font-size: 1em;
// 		background-color: #f9f9f9;
// 		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// 		font-family: 'Courier New', Courier, monospace;
// 		line-height: 1.5;
// 		color: transparent;
// 	}

// 	.formatted-text {
// 		position: absolute;
// 		top: 0;
// 		left: 0;
// 		padding: 10px;
// 		font-family: monospace;
// 		font-size: 1.2em;
// 		line-height: 1.5;
// 		color: black;
// 		pointer-events: none;
// 		white-space: pre-wrap;
// 		word-wrap: break-word;
// 		z-index: 1;
		
// 	}

// 	.snippet, .formatted-result {
// 		font-family: monospace;
// 		padding: 10px;
// 		white-space: pre-wrap;
// 		word-wrap: break-word;
// 		font-size: 16px; /* ให้ฟอนต์เท่ากัน */
// 		line-height: 1.5; /* ให้เว้นบรรทัดเท่ากัน */
// 		}

// 		.snippet {
// 		background-color: transparent;
// 		border: 1px solid Darkblue;
// 		z-index: 1;
// 		}

// 		.correct {
// 		color: #1dc21a;
// 		font-weight: bold;
// 		}

// 		.incorrect {
// 		color: red;
// 		font-weight: bold;
// 		}

// 		.placeholder {
// 		color: #514a48;
// 		font-weight: bold;
// 		}

// 		textarea::selection {
// 		background: rgba(0, 0, 0, 0.1); /* Highlight selected text */
// 		}

// 	button {
// 		margin-top: 10px;
// 		padding: 8px 16px;
// 		border: none;
// 		border-radius: 4px;
// 		background-color: #007bff;
// 		color: #fff;
// 		cursor: pointer;
// 		font-size: 1em;
// 	}

// 	button:disabled {
// 		background-color: #ccc;
// 		cursor: not-allowed;
// 	}

// 	.modal-overlay {
// 					position: fixed;
// 					top: 0;
// 					left: 0;
// 					width: 100%;
// 					height: 100%;
// 					background: rgba(0, 0, 0, 0.5);
// 					display: flex;
// 					justify-content: center;
// 					align-items: center;
// 					z-index: 1000;
// 				}
// 				.modal-content {
// 					background: white;
// 					padding: 20px;
// 					border-radius: 8px;
// 					width: 80%;
// 					max-width: 500px;
// 					text-align: center;
// 				}
// 				.modal-content h2 {
// 					font-size: 24px;
// 					margin-bottom: 15px;
// 				}
// 				.stats p {
// 					margin: 8px 0;
// 				}
// 				.modal-content button {
// 					margin-top: 15px;
// 					padding: 8px 16px;
// 					background-color: #007bff;
// 					color: white;
// 					border: none;
// 					border-radius: 4px;
// 					cursor: pointer;
// 				}
// `}</style>

