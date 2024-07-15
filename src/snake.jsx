import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 50;
const BATCH_SIZE = 32;
const MEMORY_SIZE = 10000;
const GAMMA = 0.95;
const TARGET_UPDATE_FREQUENCY = 100;

const SnakeGame = () => {
  const [snake, setSnake] = useState(() => getRandomPosition());
  const [food, setFood] = useState(() => getRandomFoodPosition());
  const [direction, setDirection] = useState(() => getRandomDirection());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const targetModelRef = useRef(null);
  const memoryRef = useRef([]);
  const [epsilon, setEpsilon] = useState(1);
  const [isTraining, setIsTraining] = useState(false);
  const [tfLoaded, setTfLoaded] = useState(false);
  const stepCountRef = useRef(0);

  const createModel = useCallback(() => {
    if (window.tf && !modelRef.current) {
      const model = window.tf.sequential();
      model.add(window.tf.layers.dense({ inputShape: [22], units: 256, activation: 'relu' }));
      model.add(window.tf.layers.dense({ units: 128, activation: 'relu' }));
      model.add(window.tf.layers.dense({ units: 64, activation: 'relu' }));
      model.add(window.tf.layers.dense({ units: 4, activation: 'linear' }));
      model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
      modelRef.current = model;
      
      // Create target model
      const targetModel = window.tf.sequential();
      targetModel.add(window.tf.layers.dense({ inputShape: [22], units: 256, activation: 'relu' }));
      targetModel.add(window.tf.layers.dense({ units: 128, activation: 'relu' }));
      targetModel.add(window.tf.layers.dense({ units: 64, activation: 'relu' }));
      targetModel.add(window.tf.layers.dense({ units: 4, activation: 'linear' }));
      targetModel.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
      targetModelRef.current = targetModel;
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js';
    script.async = true;
    script.onload = () => {
      setTfLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (tfLoaded) {
      createModel();
    }
  }, [tfLoaded, createModel]);

  useEffect(() => {
    if (gameOver) {
      resetGame();
    } else {
      const gameLoop = setInterval(async () => {
        await moveSnake();
        checkCollision();
        drawGame();
      }, GAME_SPEED);
      return () => clearInterval(gameLoop);
    }
  }, [snake, food, direction, gameOver]);

  const getState = () => {
    const head = snake[0];
    const neck = snake[1] || head;
    const tailDirection = {
      x: head.x - neck.x,
      y: head.y - neck.y
    };
    const dangerStraight = checkDanger(head, direction);
    const dangerRight = checkDanger(head, getNewDirection(direction, 'RIGHT'));
    const dangerLeft = checkDanger(head, getNewDirection(direction, 'LEFT'));
    return [
      // Direction one-hot encoding
      (direction === 'LEFT' ? 1 : 0),
      (direction === 'RIGHT' ? 1 : 0),
      (direction === 'UP' ? 1 : 0),
      (direction === 'DOWN' ? 1 : 0),
      // Danger
      dangerStraight,
      dangerRight,
      dangerLeft,
      // Food direction
      (food.x < head.x ? 1 : 0),
      (food.x > head.x ? 1 : 0),
      (food.y < head.y ? 1 : 0),
      (food.y > head.y ? 1 : 0),
      // Snake position
      head.x / GRID_SIZE,
      head.y / GRID_SIZE,
      // Food position
      food.x / GRID_SIZE,
      food.y / GRID_SIZE,
      // Distance to food
      Math.abs(head.x - food.x) / GRID_SIZE,
      Math.abs(head.y - food.y) / GRID_SIZE,
      // Tail direction
      tailDirection.x,
      tailDirection.y,
      // Snake length
      snake.length / GRID_SIZE,
      // Distance to walls
      head.x / GRID_SIZE,
      (GRID_SIZE - head.x - 1) / GRID_SIZE,
      head.y / GRID_SIZE,
      (GRID_SIZE - head.y - 1) / GRID_SIZE
    ];
  };

  const checkDanger = (head, dir) => {
    let point = { ...head };
    switch (dir) {
      case 'UP': point.y -= 1; break;
      case 'DOWN': point.y += 1; break;
      case 'LEFT': point.x -= 1; break;
      case 'RIGHT': point.x += 1; break;
      default: break;
    }
    return (
      point.x < 0 ||
      point.x >= GRID_SIZE ||
      point.y < 0 ||
      point.y >= GRID_SIZE ||
      snake.some(s => s.x === point.x && s.y === point.y)
    ) ? 1 : 0;
  };

  const getNewDirection = (currentDir, turn) => {
    const directions = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const currentIndex = directions.indexOf(currentDir);
    if (turn === 'RIGHT') {
      return directions[(currentIndex + 1) % 4];
    } else if (turn === 'LEFT') {
      return directions[(currentIndex + 3) % 4];
    }
    return currentDir;
  };

  const predict = async (state) => {
    if (modelRef.current && window.tf) {
      const prediction = await modelRef.current.predict(window.tf.tensor2d([state])).array();
      return prediction[0];
    }
    return [0, 0, 0, 0];
  };

  const getAction = async (state) => {
    if (Math.random() < epsilon) {
      return Math.floor(Math.random() * 4);
    } else {
      const prediction = await predict(state);
      return prediction.indexOf(Math.max(...prediction));
    }
  };

  const train = async (state, action, reward, nextState, done) => {
    if (modelRef.current && window.tf && !isTraining) {
      setIsTraining(true);
      try {
        const target = await predict(state);
        if (!done) {
          const futureReward = await predict(nextState);
          target[action] = reward + 0.95 * Math.max(...futureReward);
        } else {
          target[action] = reward;
        }
        await modelRef.current.fit(window.tf.tensor2d([state]), window.tf.tensor2d([target]), {
          epochs: 1,
          verbose: 0
        });
        setEpsilon(prev => Math.max(0.01, prev * 0.995));
      } catch (error) {
        console.error("Training error:", error);
      } finally {
        setIsTraining(false);
      }
    }
  };

 const moveSnake = async () => {
    const state = getState();
    const action = await getAction(state);
    const newDirection = ['LEFT', 'RIGHT', 'UP', 'DOWN'][action];
    setDirection(newDirection);

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    switch (newDirection) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
      default: break;
    }
    newSnake.unshift(head);

    let reward = -0.01; // Small penalty for each move
    let done = false;

    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      reward = 1;
      generateFood();
    } else {
      newSnake.pop();
    }

    if (checkCollisionWithoutStateUpdate(head, newSnake)) {
      reward = -1;
      done = true;
    }

    setSnake(newSnake);

    const nextState = getState();
    
    // Add experience to memory
    memoryRef.current.push({ state, action, reward, nextState, done });
    if (memoryRef.current.length > MEMORY_SIZE) {
      memoryRef.current.shift();
    }

    await train();

    if (done) {
      setGameOver(true);
    }

    stepCountRef.current += 1;
  };

  const getBatch = () => {
    const batch = [];
    const len = memoryRef.current.length;
    for (let i = 0; i < BATCH_SIZE; i++) {
      const index = Math.floor(Math.random() * len);
      batch.push(memoryRef.current[index]);
    }
    return batch;
  };

  const checkCollision = () => {
    const head = snake[0];
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
    }
  };

  const checkCollisionWithoutStateUpdate = (head, snakeBody) => {
    return (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snakeBody.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
  };

  const generateFood = () => {
    let newFood;
    do {
      newFood = getRandomFoodPosition();
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
        ctx.stroke();
      }

      // Draw snake
      ctx.fillStyle = '#60A5FA'; // Tailwind blue-400
      snake.forEach(segment => {
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });

      // Draw food
      ctx.fillStyle = '#F87171'; // Tailwind red-400
      ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  };

  const resetGame = () => {
    setSnake(getRandomPosition());
    generateFood();
    setDirection(getRandomDirection());
    setGameOver(false);
    setHighScore(s => Math.max(s, score));
    setScore(0);
    setGamesPlayed(g => g + 1);
  };

  function getRandomPosition() {
    return [{ 
      x: Math.floor(Math.random() * GRID_SIZE), 
      y: Math.floor(Math.random() * GRID_SIZE) 
    }];
  }

  function getRandomFoodPosition() {
    return { 
      x: Math.floor(Math.random() * GRID_SIZE), 
      y: Math.floor(Math.random() * GRID_SIZE) 
    };
  }

  function getRandomDirection() {
    const directions = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="w-[440px] bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <h2 className="text-2xl font-bold text-white">Neuro Snake</h2>
        </div>
        <div className="p-6">
          <div className="mb-4 flex justify-between text-gray-300">
            <div>Score: {score}</div>
            <div>High Score: {highScore}</div>
          </div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className="border-4 border-gray-700 rounded-lg shadow-inner bg-gray-900"
            />
          </div>
          <div className="mt-4 flex justify-between text-gray-400 text-sm">
            <div>Games: {gamesPlayed}</div>
            <div>Epsilon: {epsilon.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;