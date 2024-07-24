import React, { useState, useEffect } from 'react';
import { gradientDescent } from 'gradient-descent';

const OptimizationComponent = ({ equation, points }) => {
  const [optimizedEquation, setOptimizedEquation] = useState(equation);
  const [iterations, setIterations] = useState(100);
  const [learningRate, setLearningRate] = useState(0.01);

  useEffect(() => {
    const optimize = async () => {
      const optimizedCoefficients = await gradientDescent(
        equation,
        points,
        iterations,
        learningRate
      );
      const optimizedEquation = optimizedCoefficients.map((coefficient, index) => {
        const power = iterations - index;
        return `${coefficient}x^${power}`;
      }).join(' + ');
      setOptimizedEquation(optimizedEquation);
    };
    optimize();
  }, [equation, points, iterations, learningRate]);

  return (
    <div>
      <h2>Optimized Equation:</h2>
      <p>{optimizedEquation}</p>
      <label>
        Iterations:
        <input
          type="number"
          value={iterations}
          onChange={(e) => setIterations(e.target.value)}
        />
      </label>
      <label>
        Learning Rate:
        <input
          type="number"
          value={learningRate}
          onChange={(e) => setLearningRate(e.target.value)}
        />
      </label>
    </div>
  );
};

export default OptimizationComponent;