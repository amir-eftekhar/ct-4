import React, { useState, useEffect } from 'react';
import Konva from 'konva';

const GraphComponent = () => {
  const [stage, setStage] = useState(null);
  const [layer, setLayer] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const stage = new Konva.Stage({
      container: 'graph-container',
      width: 800,
      height: 600,
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    setStage(stage);
    setLayer(layer);
  }, []);

  const handleMouseDown = (e) => {
    setDrawing(true);
    const point = stage.getPointerPosition();
    setPoints((prevPoints) => [...prevPoints, point]);
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      const point = stage.getPointerPosition();
      setPoints((prevPoints) => [...prevPoints, point]);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <div id="graph-container">
      <Konva.Stage
        ref={stage}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Konva.Layer ref={layer}>
          {points.map((point, index) => (
            <Konva.Circle
              key={index}
              x={point.x}
              y={point.y}
              radius={5}
              fill="#333"
            />
          ))}
        </Konva.Layer>
      </Konva.Stage>
    </div>
  );
};

export default GraphComponent;