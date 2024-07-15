import React, { useState } from 'react';

const FlowchartNode = ({ text, onClick, isActive, x, y, width = 180, height = 70 }) => (
  <div 
    className={`absolute p-2 rounded-lg border-2 shadow-md transition-all duration-300 flex items-center justify-center text-center ${
      isActive ? 'bg-blue-200 border-blue-500 scale-105' : 'bg-white border-gray-300'
    }`}
    style={{ left: x, top: y, width: width, height: height, transform: 'translate(-50%, -50%)' }}
    onClick={onClick}
  >
    <div className="text-sm font-semibold">{text}</div>
  </div>
);

const FlowchartLine = ({ start, end, color = 'gray' }) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy);

  return (
    <div
      className={`absolute bg-${color}-500`}
      style={{
        left: start.x,
        top: start.y,
        width: length,
        height: '2px',
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
      }}
    />
  );
};

const ComprehensiveFactoringFlowchart = () => {
  const [activeNode, setActiveNode] = useState('start');

  const nodes = [
    { id: 'start', text: 'Start', x: 600, y: 50, width: 100 },
    { id: 'gcf', text: 'Greatest Common Factor?', x: 600, y: 150 },
    { id: 'factorGCF', text: 'Factor out GCF leaving GCF(quotient)', x: 900, y: 150, width: 220 },
    { id: 'terms', text: 'How many terms?', x: 600, y: 250 },
    { id: 'fourPlus', text: '4+ terms', x: 900, y: 250, width: 100 },
    { id: 'grouping', text: 'Factor by grouping', x: 1200, y: 250, width: 160 },
    { id: 'two', text: '2 terms', x: 300, y: 350, width: 100 },
    { id: 'three', text: '3 terms', x: 900, y: 350, width: 100 },
    { id: 'diffSquares', text: 'Difference of squares?', x: 300, y: 450 },
    { id: 'sumDiffCubes', text: 'Sum or difference of cubes?', x: 300, y: 550, width: 200 },
    { id: 'sumSquares', text: 'Sum of squares?', x: 300, y: 650 },
    { id: 'factorDiffSquares', text: 'a²-b² = (a+b)(a-b)', x: 600, y: 450, width: 180 },
    { id: 'factorSumDiffCubes', text: 'a³+b³=(a+b)(a²-ab+b²)\na³-b³=(a-b)(a²+ab+b²)', x: 600, y: 550, width: 240, height: 100 },
    { id: 'notFactorable', text: 'a²+b² - not factorable', x: 600, y: 650, width: 200 },
    { id: 'perfectSquare', text: 'Perfect square trinomial?', x: 900, y: 450 },
    { id: 'factorPerfectSquare', text: 'a²±2ab+b² = (a±b)²', x: 1200, y: 450, width: 200 },
    { id: 'coefficientOne', text: 'Coefficient of first term = 1?', x: 900, y: 550, width: 220 },
    { id: 'factorEasy', text: 'Factor easy way\nx²+bx+c=(x+p)(x+q)\nb=p+q, c=p*q', x: 1200, y: 550, width: 240, height: 100 },
    { id: 'factorAC', text: 'Factor using AC method', x: 900, y: 650 },
    { id: 'specialPatterns', text: 'Check for special patterns\n(e.g. difference of squares in disguise)', x: 600, y: 750, width: 240, height: 80 },
    { id: 'rationalRoots', text: 'Use rational root theorem', x: 900, y: 750, width: 200 },
    { id: 'syntheticDivision', text: 'Apply synthetic division', x: 1200, y: 750, width: 200 },
    { id: 'end', text: 'End: Fully factored or prime', x: 600, y: 850, width: 220 }
  ];

  const lines = [
    { start: { x: 600, y: 80 }, end: { x: 600, y: 115 } },
    { start: { x: 690, y: 150 }, end: { x: 790, y: 150 }, color: 'green' },
    { start: { x: 600, y: 185 }, end: { x: 600, y: 215 }, color: 'red' },
    { start: { x: 900, y: 185 }, end: { x: 600, y: 215 } },
    { start: { x: 690, y: 250 }, end: { x: 850, y: 250 } },
    { start: { x: 950, y: 250 }, end: { x: 1120, y: 250 } },
    { start: { x: 510, y: 250 }, end: { x: 300, y: 315 } },
    { start: { x: 690, y: 250 }, end: { x: 900, y: 315 } },
    { start: { x: 300, y: 385 }, end: { x: 300, y: 415 } },
    { start: { x: 390, y: 450 }, end: { x: 510, y: 450 }, color: 'green' },
    { start: { x: 300, y: 485 }, end: { x: 300, y: 515 }, color: 'red' },
    { start: { x: 300, y: 585 }, end: { x: 300, y: 615 }, color: 'red' },
    { start: { x: 400, y: 550 }, end: { x: 480, y: 550 }, color: 'green' },
    { start: { x: 400, y: 650 }, end: { x: 500, y: 650 }, color: 'green' },
    { start: { x: 900, y: 385 }, end: { x: 900, y: 415 } },
    { start: { x: 990, y: 450 }, end: { x: 1100, y: 450 }, color: 'green' },
    { start: { x: 900, y: 485 }, end: { x: 900, y: 515 }, color: 'red' },
    { start: { x: 1010, y: 550 }, end: { x: 1080, y: 550 }, color: 'green' },
    { start: { x: 900, y: 585 }, end: { x: 900, y: 615 }, color: 'red' },
    { start: { x: 600, y: 685 }, end: { x: 600, y: 710 }, color: 'red' },
    { start: { x: 600, y: 790 }, end: { x: 600, y: 815 } },
    { start: { x: 900, y: 685 }, end: { x: 900, y: 715 } },
    { start: { x: 1000, y: 750 }, end: { x: 1100, y: 750 } },
    { start: { x: 1200, y: 790 }, end: { x: 600, y: 815 } },
  ];

  const handleNodeClick = (id) => {
    setActiveNode(id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Factoring All types of polynomials</h2>
      <div className="text-center mb-4">
        <span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>
        <span className="mr-4">Yes</span>
        <span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>
        <span>No</span>
      </div>
      <div className="relative w-[1400px] h-[900px] border border-gray-300 mx-auto my-8 bg-gray-50">
        {nodes.map((node) => (
          <FlowchartNode
            key={node.id}
            {...node}
            isActive={activeNode === node.id}
            onClick={() => handleNodeClick(node.id)}
          />
        ))}
        {lines.map((line, index) => (
          <FlowchartLine key={index} {...line} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Example Problems:</h3>
        <div className="inline-block text-left">
          <ol className="list-decimal list-inside space-y-4">
            <li>
              <strong>GCF and Trinomial:</strong> 6x² + 18x + 12
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Start → GCF? Yes → Factor out GCF: 6(x² + 3x + 2)</li>
                <li>How many terms? 3 → Perfect square? No → Coefficient of x² = 1? Yes</li>
                <li>Factor easy way: 6(x² + 3x + 2) = 6(x + 2)(x + 1)</li>
                <li>End: Fully factored</li>
              </ul>
            </li>
            <li>
              <strong>Difference of Squares:</strong> 16x² - 25
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Start → GCF? No → How many terms? 2 → Difference of squares? Yes</li>
                <li>Factor as a² - b²: (4x)² - 5²</li>
                <li>Apply (a+b)(a-b): (4x + 5)(4x - 5)</li>
                <li>End: Fully factored</li>
              </ul>
            </li>
            <li>
              <strong>Sum of Cubes:</strong> x³ + 8
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Start → GCF? No → How many terms? 2 → Difference of squares? No</li>
                <li>Sum or difference of cubes? Yes (sum of cubes)</li>
                <li>Apply a³ + b³ = (a + b)(a² - ab + b²)</li>
                <li>x³ + 8 = (x + 2)(x² - 2x + 4)</li>
                <li>End: Fully factored</li>
              </ul>
            </li>
            <li>
              <strong>Perfect Square Trinomial:</strong> 4x² + 12x + 9
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Start → GCF? No → How many terms? 3 → Perfect square trinomial? Yes</li>
                <li>Recognize a² + 2ab + b² pattern</li>
                <li>Factor as: (2x + 3)²</li>
                <li>End: Fully factored</li>
              </ul>
            </li>
            <li>
              <strong>AC Method:</strong> 2x² + 7x + 3
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Start → GCF? No → How many terms? 3 → Perfect square? No</li>
                <li>Coefficient of x² = 1? No → Factor using AC method</li>
                <li>a=2, b=7, c=3</li>
                <li>ac = 2 * 3 = 6</li>
                <li>Find factors of 6 that add up to 7: 1 and 6</li>
                <li>Rewrite middle term: 2x² + x + 6x + 3</li>
                <li>Group and factor: (2x² + x) + (6x + 3)</li>
                <li>x(2x + 1) + 3(2x + 1)</li>
                <li>Factor out common factor: (2x + 1)(x + 3)</li>
                <li>End: Fully factored</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveFactoringFlowchart;
