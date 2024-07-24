import React, { useState, useEffect } from 'react';
import GraphComponent from './GraphComponent';
import EquationGenerator from './EquationGenerator';
import OptimizationComponent from './OptimizationComponent';

const App3 = () => {
  const [points, setPoints] = useState([]);
  const [equation, setEquation] = useState('');
  const [numTerms, setNumTerms] = useState(3);

  const handlePointsChange = (newPoints) => {
    setPoints(newPoints);
    const equation = EquationGenerator(newPoints, numTerms);
    setEquation(equation);
  };

  return (
    <div>
      <GraphComponent points={points} onChange={handlePointsChange} />
      <EquationGenerator equation={equation} numTerms={numTerms} />
      <OptimizationComponent equation={equation} points={points} />
      <label>
        Number of Terms:
        <input
          type="number"
          value={numTerms}
          onChange={(e) => setNumTerms(e.target.value)}
        />
      </label>
    </div>
  );
};

export default App3;