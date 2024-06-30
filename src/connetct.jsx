import React, { useState, useEffect } from 'react';

const ROWS = 6;
const COLS = 7;

const styles = {
  container: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4",
  title: "text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500",
  board: "grid grid-cols-7 gap-2 p-4 bg-blue-900 rounded-xl shadow-2xl mb-8",
  cell: "w-12 h-12 bg-blue-200 rounded-full shadow-inner transition-all duration-300 ease-in-out",
  playerCell: "bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md",
  aiCell: "bg-gradient-to-br from-red-400 to-red-600 shadow-md",
  resetButton: "px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-lg font-semibold",
  announcement: "mb-4 p-4 bg-white rounded-lg shadow-md text-xl font-semibold text-center w-full max-w-md animate-bounce",
  difficultyContainer: "mb-6 flex flex-col items-center",
  difficultyLabel: "text-lg font-semibold mb-2 text-white",
  difficultySelector: "flex space-x-2",
  difficultyButton: "px-4 py-2 rounded-full text-white font-medium transition-all duration-300 ease-in-out",
  difficultyButtonActive: "bg-yellow-500 shadow-md",
  difficultyButtonInactive: "bg-blue-500 hover:bg-blue-600",
};

const ConnectFour = () => {
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');

  const difficulties = {
    easy: 2,
    medium: 4,
    hard: 6,
  };

  const checkWinner = (board, player) => {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (board[r][c] === player &&
            board[r][c+1] === player &&
            board[r][c+2] === player &&
            board[r][c+3] === player) {
          return true;
        }
      }
    }

    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] === player &&
            board[r+1][c] === player &&
            board[r+2][c] === player &&
            board[r+3][c] === player) {
          return true;
        }
      }
    }

    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (board[r][c] === player &&
            board[r+1][c+1] === player &&
            board[r+2][c+2] === player &&
            board[r+3][c+3] === player) {
          return true;
        }
      }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (board[r][c] === player &&
            board[r-1][c+1] === player &&
            board[r-2][c+2] === player &&
            board[r-3][c+3] === player) {
          return true;
        }
      }
    }

    return false;
  };

  const handleClick = (col) => {
    if (winner || !isPlayerTurn) return;
    
    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][col]) {
        newBoard[r][col] = 'player';
        setBoard(newBoard);
        setIsPlayerTurn(false);
        break;
      }
    }
  };

const minimax = (board, depth, isMaximizing, alpha, beta) => {
  if (checkWinner(board, 'ai')) return 100 - depth;
  if (checkWinner(board, 'player')) return depth - 100;
  if (depth === 0) return 0;
  if (board.every(row => row.every(cell => cell !== null))) return 0;
  if (isMaximizing) {
    let maxValue = -Infinity;
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        const newBoard = board.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
          if (!newBoard[r][c]) {
            newBoard[r][c] = 'ai';
            break;
          }
        }
        const value = minimax(newBoard, depth - 1, false, alpha, beta);
        maxValue = Math.max(maxValue, value);
        alpha = Math.max(alpha, value);
        if (beta <= alpha) break;
      }
    }
    return maxValue;
  } else {
    let minValue = Infinity;
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        const newBoard = board.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
          if (!newBoard[r][c]) {
            newBoard[r][c] = 'player';
            break;
          }
        }
        const value = minimax(newBoard, depth - 1, true, alpha, beta);
        minValue = Math.min(minValue, value);
        beta = Math.min(beta, value);
        if (beta <= alpha) break;
      }
    }
    return minValue;
  }
};


  const aiMove = () => {
    let bestScore = -Infinity;
    let bestMove;

    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        const newBoard = board.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
          if (!newBoard[r][c]) {
            newBoard[r][c] = 'ai';
            break;
          }
        }
        const score = minimax(newBoard, difficulties[difficulty], false, -Infinity, Infinity);
        if (score > bestScore) {
          bestScore = score;
          bestMove = c;
        }
      }
    }

    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][bestMove]) {
        newBoard[r][bestMove] = 'ai';
        setBoard(newBoard);
        setIsPlayerTurn(true);
        break;
      }
    }
  };

  useEffect(() => {
    if (checkWinner(board, 'player')) {
      setWinner('player');
      setAnnouncement("You win!");
    } else if (checkWinner(board, 'ai')) {
      setWinner('ai');
      setAnnouncement("AI wins!");
    } else if (board.every(row => row.every(cell => cell !== null))) {
      setAnnouncement("It's a draw!");
    } else if (!isPlayerTurn) {
      const timerId = setTimeout(aiMove, 500);
      return () => clearTimeout(timerId);
    }
  }, [board, isPlayerTurn]);

  const resetGame = () => {
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setAnnouncement(null);
  };

  const renderCell = (r, c) => (
    <div
      key={`${r}-${c}`}
      className={`${styles.cell} ${board[r][c] === 'player' ? styles.playerCell : board[r][c] === 'ai' ? styles.aiCell : ''}`}
      onClick={() => handleClick(c)}
    />
  );

  const renderDifficultyButton = (level) => (
    <button
      key={level}
      onClick={() => setDifficulty(level)}
      className={`${styles.difficultyButton} ${
        difficulty === level ? styles.difficultyButtonActive : styles.difficultyButtonInactive
      }`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </button>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connect Four</h1>
      {announcement && (
        <div className={styles.announcement}>
          {announcement}
        </div>
      )}
      <div className={styles.difficultyContainer}>
        <label className={styles.difficultyLabel}>Select Difficulty:</label>
        <div className={styles.difficultySelector}>
          {['easy', 'medium', 'hard'].map(renderDifficultyButton)}
        </div>
      </div>
      <div className={styles.board}>
        {board.map((row, r) => row.map((_, c) => renderCell(r, c)))}
      </div>
      <button onClick={resetGame} className={styles.resetButton}>
        New Game
      </button>
    </div>
  );
};

export default ConnectFour;