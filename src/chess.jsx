import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Loader2, Trophy, AlertCircle } from 'lucide-react';

const DIFFICULTIES = {
  Easy: 2,
  Medium: 3,
  Hard: 4,
  Grandmaster: 5
};

const PIECE_VALUE = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [difficulty, setDifficulty] = useState('Medium');
  const [playerColor, setPlayerColor] = useState('w');
  const [gameStatus, setGameStatus] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [invalidMoveMessage, setInvalidMoveMessage] = useState('');
  const workerRef = useRef(null);

  const checkGameStatus = useCallback(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
        setShowWinAnimation(true);
      }
      else if (game.isDraw()) setGameStatus("It's a draw!");
      else if (game.isStalemate()) setGameStatus("Stalemate!");
      else if (game.isThreefoldRepetition()) setGameStatus("Draw by repetition!");
      else if (game.isInsufficientMaterial()) setGameStatus("Draw by insufficient material!");
    } else {
      setGameStatus('');
    }
  }, [game]);

  useEffect(() => {
    if (game.turn() !== playerColor && !game.isGameOver()) {
      setIsThinking(true);
      const moveTimeout = setTimeout(() => {
        const workerScript = `
          importScripts('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js');
          
          function evaluateBoard(game, pieceValue) {
            let totalEvaluation = 0;
            const board = game.board();
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 8; j++) {
                totalEvaluation += getPieceValue(board[i][j], pieceValue);
              }
            }
            return totalEvaluation;
          }

          function getPieceValue(piece, pieceValue) {
            if (piece === null) return 0;
            const absoluteValue = pieceValue[piece.type];
            return piece.color === 'w' ? absoluteValue : -absoluteValue;
          }

          function minimax(game, depth, alpha, beta, isMaximizingPlayer, pieceValue) {
            if (depth === 0) {
              return evaluateBoard(game, pieceValue);
            }

            const moves = game.moves({ verbose: true });
            
            if (isMaximizingPlayer) {
              let maxEval = -Infinity;
              for (let move of moves) {
                game.move(move);
                const eval = minimax(game, depth - 1, alpha, beta, false, pieceValue);
                game.undo();
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
              }
              return maxEval;
            } else {
              let minEval = Infinity;
              for (let move of moves) {
                game.move(move);
                const eval = minimax(game, depth - 1, alpha, beta, true, pieceValue);
                game.undo();
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
              }
              return minEval;
            }
          }

          function getBestMove(game, depth, pieceValue) {
            const moves = game.moves({ verbose: true });
            let bestMove = null;
            let bestValue = game.turn() === 'w' ? -Infinity : Infinity;
            
            for (let move of moves) {
              game.move(move);
              const boardValue = minimax(game, depth - 1, -Infinity, Infinity, game.turn() === 'w', pieceValue);
              game.undo();
              
              if ((game.turn() === 'w' && boardValue > bestValue) || (game.turn() === 'b' && boardValue < bestValue)) {
                bestValue = boardValue;
                bestMove = move;
              }
            }
            
            return bestMove;
          }

          self.onmessage = function(e) {
            const [fen, depth, pieceValue] = e.data;
            const game = new Chess(fen);
            const bestMove = getBestMove(game, depth, pieceValue);
            self.postMessage(bestMove);
          }
        `;
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        workerRef.current = new Worker(URL.createObjectURL(blob));

        workerRef.current.onmessage = function(e) {
          const bestMove = e.data;
          game.move(bestMove);
          setLastMove({ from: bestMove.from, to: bestMove.to });
          setGame(new Chess(game.fen()));
          setIsThinking(false);
          checkGameStatus();
        };

        workerRef.current.postMessage([game.fen(), DIFFICULTIES[difficulty], PIECE_VALUE]);

        return () => {
          if (workerRef.current) {
            workerRef.current.terminate();
          }
          clearTimeout(moveTimeout);
        };
      }, 500); // Delay to show piece movement before AI starts thinking
    }
  }, [game, difficulty, playerColor, checkGameStatus]);

  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move === null) {
        setInvalidMoveMessage('Invalid move. Please try again.');
        setTimeout(() => setInvalidMoveMessage(''), 3000);
        return false;
      }

      setLastMove({ from: sourceSquare, to: targetSquare });
      setGame(new Chess(game.fen()));
      checkGameStatus();
      return true;
    } catch (error) {
      setInvalidMoveMessage('Invalid move. Please try again.');
      setTimeout(() => setInvalidMoveMessage(''), 3000);
      return false;
    }
  };

  const resetGame = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    setGame(new Chess());
    setGameStatus('');
    setLastMove(null);
    setShowWinAnimation(false);
    setIsThinking(false);
    setInvalidMoveMessage('');
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const changePlayerColor = (color) => {
    setPlayerColor(color);
    resetGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-6 text-white">Chess Bot</h1>
      <div className="mb-4">
        <select 
          className="px-4 py-2 rounded bg-gray-700 text-white"
          value={difficulty} 
          onChange={(e) => changeDifficulty(e.target.value)}
        >
          {Object.keys(DIFFICULTIES).map((diff) => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <button 
          className={`px-4 py-2 rounded ${playerColor === 'w' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
          onClick={() => changePlayerColor('w')}
        >
          Play as White
        </button>
        <button 
          className={`px-4 py-2 rounded ml-2 ${playerColor === 'b' ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white'}`}
          onClick={() => changePlayerColor('b')}
        >
          Play as Black
        </button>
      </div>
      <div className="w-96 h-96 relative">
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          boardOrientation={playerColor === 'w' ? 'white' : 'black'}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
          customSquareStyles={{
            ...(lastMove && {
              [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
              [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
            })
          }}
        />
        {isThinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader2 className="w-16 h-16 text-white animate-spin" />
          </div>
        )}
        {showWinAnimation && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
          </div>
        )}
      </div>
      {(gameStatus || invalidMoveMessage) && (
        <div className="mt-4 p-2 bg-gray-700 text-white rounded flex items-center">
          {invalidMoveMessage && <AlertCircle className="mr-2 text-red-500" />}
          {gameStatus || invalidMoveMessage}
        </div>
      )}
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
      >
        New Game
      </button>
    </div>
  );
};

export default ChessGame;