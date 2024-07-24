import React, { useState, useEffect } from 'react';
import { ChevronDown, Cpu, User } from 'lucide-react';

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER = 1;
const BOT = 2;

const difficulties = {
  easy: 2,
  medium: 4,
  hard: 6,
};

const initialBoard = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));

const Connect4 = () => {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    if (currentPlayer === BOT && !gameOver) {
      makeBotMove();
    }
  }, [currentPlayer, gameOver]);

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer(PLAYER);
    setGameOver(false);
    setWinner(null);
  };

  const makeBotMove = () => {
    const newBoard = board.map(row => [...row]);
    let move = findWinningMove(newBoard, BOT);
    if (move === null) {
      move = findWinningMove(newBoard, PLAYER);
    }
    if (move === null) {
      move = findBestMove(newBoard, difficulties[difficulty]);
    }
    
    if (move !== null) {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newBoard[r][move] === EMPTY) {
          newBoard[r][move] = BOT;
          break;
        }
      }
      setBoard(newBoard);
      checkForWinner(newBoard, BOT);
      setCurrentPlayer(PLAYER);
    }
  };

  const findWinningMove = (board, player) => {
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === EMPTY) {
        const newBoard = board.map(row => [...row]);
        let r = ROWS - 1;
        while (r >= 0 && newBoard[r][c] !== EMPTY) r--;
        newBoard[r][c] = player;
        if (getWinner(newBoard) === player) {
          return c;
        }
      }
    }
    return null;
  };

  const handleColumnClick = (col) => {
    if (gameOver || currentPlayer === BOT) return;

    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][col] === EMPTY) {
        newBoard[r][col] = PLAYER;
        setBoard(newBoard);
        checkForWinner(newBoard, PLAYER);
        setCurrentPlayer(BOT);
        break;
      }
    }
  };

  const checkForWinner = (board, player) => {
    const winner = getWinner(board);
    if (winner !== null) {
      setGameOver(true);
      setWinner(winner);
    }
  };

  const findBestMove = (board, depth) => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === EMPTY) {
        const newBoard = board.map(row => [...row]);
        let r = ROWS - 1;
        while (r >= 0 && newBoard[r][c] !== EMPTY) r--;
        newBoard[r][c] = BOT;

        const score = minimax(newBoard, depth - 1, false, -Infinity, Infinity);
        if (score > bestScore) {
          bestScore = score;
          bestMove = c;
        }
      }
    }

    return bestMove;
  };

  const minimax = (board, depth, isMaximizing, alpha, beta) => {
    const winner = getWinner(board);
    if (winner === BOT) return 1000000;
    if (winner === PLAYER) return -1000000;
    if (winner === EMPTY) return 0;
    if (depth === 0) return evaluateBoard(board);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let c = 0; c < COLS; c++) {
        if (board[0][c] === EMPTY) {
          const newBoard = board.map(row => [...row]);
          let r = ROWS - 1;
          while (r >= 0 && newBoard[r][c] !== EMPTY) r--;
          newBoard[r][c] = BOT;

          const evalScore = minimax(newBoard, depth - 1, false, alpha, beta);
          maxEval = Math.max(maxEval, evalScore);
          alpha = Math.max(alpha, evalScore);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let c = 0; c < COLS; c++) {
        if (board[0][c] === EMPTY) {
          const newBoard = board.map(row => [...row]);
          let r = ROWS - 1;
          while (r >= 0 && newBoard[r][c] !== EMPTY) r--;
          newBoard[r][c] = PLAYER;

          const evalScore = minimax(newBoard, depth - 1, true, alpha, beta);
          minEval = Math.min(minEval, evalScore);
          beta = Math.min(beta, evalScore);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  };

  const getWinner = (board) => {
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal top-left to bottom-right
      [1, -1], // diagonal top-right to bottom-left
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] !== EMPTY) {
          for (const [dr, dc] of directions) {
            let count = 1;
            for (let i = 1; i < 4; i++) {
              const newR = r + i * dr;
              const newC = c + i * dc;
              if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS && board[newR][newC] === board[r][c]) {
                count++;
              } else {
                break;
              }
            }
            if (count === 4) {
              return board[r][c];
            }
          }
        }
      }
    }

    if (board.every(row => row.every(cell => cell !== EMPTY))) {
      return EMPTY;
    }

    return null;
  };

  const evaluateBoard = (board) => {
    let score = 0;
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal top-left to bottom-right
      [1, -1], // diagonal top-right to bottom-left
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        for (const [dr, dc] of directions) {
          const line = [];
          for (let i = 0; i < 4; i++) {
            const newR = r + i * dr;
            const newC = c + i * dc;
            if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
              line.push(board[newR][newC]);
            }
          }
          if (line.length === 4) {
            score += evaluateLine(line);
          }
        }
      }
    }

    return score;
  };

  const evaluateLine = (line) => {
    const botCount = line.filter(cell => cell === BOT).length;
    const playerCount = line.filter(cell => cell === PLAYER).length;
    const emptyCount = line.filter(cell => cell === EMPTY).length;

    if (botCount === 4) return 1000;
    if (playerCount === 4) return -1000;
    if (botCount === 3 && emptyCount === 1) return 100;
    if (playerCount === 3 && emptyCount === 1) return -100;
    if (botCount === 2 && emptyCount === 2) return 10;
    if (playerCount === 2 && emptyCount === 2) return -10;
    return 0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Connect Four</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            New Game
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Difficulty:</span>
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                disabled={gameOver || currentPlayer === BOT}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 bg-blue-200 p-4 rounded-lg">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-inner flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleColumnClick(colIndex)}
              >
                {cell === PLAYER && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg" />
                )}
                {cell === BOT && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg" />
                )}
              </div>
            ))
          )}
        </div>
        {gameOver && (
          <div className="mt-4 text-center">
            {winner === EMPTY ? (
              <p className="text-xl font-bold text-gray-700">It's a draw!</p>
            ) : (
              <p className="text-xl font-bold text-gray-700">
                {winner === PLAYER ? (
                  <span className="flex items-center justify-center">
                    <User className="mr-2" /> You win!
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Cpu className="mr-2" /> Bot wins!
                  </span>
                )}
              </p>
            )}
          </div>
        )}
        {!gameOver && (
          <div className="mt-4 text-center">
            <p className="text-xl font-bold text-gray-700">
              {currentPlayer === PLAYER ? (
                <span className="flex items-center justify-center">
                  <User className="mr-2" /> Your turn
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Cpu className="mr-2" /> Bot's turn
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect4;