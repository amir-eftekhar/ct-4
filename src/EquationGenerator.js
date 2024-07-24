
const EquationGenerator = (points, numTerms) => {
    const xValues = points.map((point) => point.x);
    const yValues = points.map((point) => point.y);
  
    const coefficients = [];
    for (let i = 0; i <= numTerms; i++) {
      let sum = 0;
      for (let j = 0; j < points.length; j++) {
        sum += Math.pow(xValues[j], i) * yValues[j];
      }
      coefficients.push(sum / points.length);
    }
  
    const equation = coefficients.map((coefficient, index) => {
      const power = numTerms - index;
      return `${coefficient}x^${power}`;
    }).join(' + ');
  
    return equation;
  };

export default EquationGenerator;