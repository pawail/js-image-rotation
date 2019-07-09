import React, { useCallback, useEffect, useState } from 'react';

import './ImageDisplay.css';

function ImageDisplay({ title, subtitle, imageData }) {
  const [canvas, setCanvas] = useState(null),
    setCanvasReference = useCallback(canvas => {
      setCanvas(canvas);
    }, []);

  useEffect(() => {
    if (canvas !== null & imageData !== null) {
      canvas.getContext('2d').putImageData(imageData, 0, 0)
    }
  }, [canvas, imageData])

  return imageData === undefined || imageData === null ? null : (
    <div className="ImageDisplayContainer">
      <h3>{title} <span>{subtitle}</span></h3>
      <p>{imageData.width}px by {imageData.height}px</p>
      <canvas className="ImageDisplayCanvas" ref={setCanvasReference} width={imageData.width} height={imageData.height} />
    </div>    
  );
}

export default ImageDisplay;
