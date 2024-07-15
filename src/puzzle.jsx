import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';

const GRID_SIZE = 10;
const SHAPE_TYPES = [
  [[1]],
  [[1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1, 1]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 0], [1, 1], [0, 1]],
  [[0, 1], [1, 1], [1, 0]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];

const COLORS = ['#FFA500', '#FF4500', '#9370DB', '#20B2AA', '#32CD32', '#4169E1'];

const Cell = ({ color, onClick }) => {
  return (
    <motion.div
      className="w-8 h-8 rounded-sm m-px"
      style={{ 
        backgroundColor: color || 'rgba(0,0,0,0.2)',
        boxShadow: color ? 'inset 0 0 5px rgba(255,255,255,0.5)' : 'none'
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ opacity: color ? 1 : 0.3 }}
    />
  );
};

const Shape = ({ shape, color }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'shape',
    item: { shape, color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'grid',
        gridTemplateColumns: `repeat(${shape[0].length}, 1fr)`,
        gap: '1px',
      }}
    >
      {shape.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className="w-6 h-6 rounded-sm"
            style={{
              backgroundColor: cell ? color : 'transparent',
              boxShadow: cell ? 'inset 0 0 3px rgba(255,255,255,0.5)' : 'none'
            }}
          />
        ))
      )}
    </div>
  );
};

const BlockPuzzleGame = () => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [currentShapes, setCurrentShapes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateNewShapes();
  }, []);

  const generateNewShapes = () => {
    const newShapes = Array(3).fill().map(() => ({
      shape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setCurrentShapes(newShapes);
  };

  const [, drop] = useDrop(() => ({
    accept: 'shape',
    drop: (item, monitor) => {
      const { x, y } = monitor.getClientOffset();
      const element = document.elementFromPoint(x, y);
      if (element) {
        const gridPos = element.getAttribute('data-pos');
        if (gridPos) {
          const [row, col] = gridPos.split('-').map(Number);
          placeShape(row, col, item.shape, item.color);
        }
      }
    },
  }));

  const canPlaceShape = (row, col, shape) => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          if (row + i >= GRID_SIZE || col + j >= GRID_SIZE || grid[row + i][col + j]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placeShape = (row, col, shape, color) => {
    if (!canPlaceShape(row, col, shape)) return;

    const newGrid = grid.map(row => [...row]);
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          newGrid[row + i][col + j] = color;
        }
      }
    }
    setGrid(newGrid);
    setCurrentShapes(currentShapes.filter(s => s.shape !== shape));
    if (currentShapes.length === 1) {
      generateNewShapes();
    }
    checkAndClearLines(newGrid);
    checkGameOver();
  };

  const checkAndClearLines = (newGrid) => {
    let rowsToRemove = [];
    let colsToRemove = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      if (newGrid[i].every(cell => cell !== null)) rowsToRemove.push(i);
      if (newGrid.every(row => row[i] !== null)) colsToRemove.push(i);
    }

    if (rowsToRemove.length > 0 || colsToRemove.length > 0) {
      setTimeout(() => {
        const updatedGrid = newGrid.map(row => [...row]);
        rowsToRemove.forEach(rowIndex => {
          updatedGrid[rowIndex] = Array(GRID_SIZE).fill(null);
        });
        colsToRemove.forEach(colIndex => {
          updatedGrid.forEach(row => {
            row[colIndex] = null;
          });
        });
        setGrid(updatedGrid);
        setScore(prevScore => prevScore + (rowsToRemove.length + colsToRemove.length) * 10);
      }, 300);
    }
  };

  const checkGameOver = () => {
    if (currentShapes.every(({ shape }) => 
      !grid.some((row, i) => 
        row.some((_, j) => canPlaceShape(i, j, shape))
      )
    )) {
      setGameOver(true);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900 p-4">
        <h1 className="text-4xl font-bold mb-4 text-white">Block Puzzle</h1>
        <div className="mb-4 text-white text-xl">Score: {score}</div>
        <div 
          ref={drop}
          className="grid gap-px p-4 bg-gray-800 rounded-lg shadow-lg"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                color={cell}
                data-pos={`${rowIndex}-${colIndex}`}
              />
            ))
          )}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          {currentShapes.map((shape, index) => (
            <Shape key={index} {...shape} />
          ))}
        </div>
        {gameOver && (
          <div className="mt-4 text-2xl font-bold text-red-500">Game Over!</div>
        )}
      </div>
    </DndProvider>
  );
};

export default BlockPuzzleGame;