import React, { useState } from 'react';

import ImagePicker from './components/ImagePicker/ImagePicker';
import ImageDisplay from './components/ImageDisplay/ImageDisplay';
import Rotation from './components/Rotation/Rotation';
import Rotator from './Rotator';

import './App.css';

function App() {
  const [selectedImageData, setSelectedImageData] = useState(null),
    [rotatedImageData, setRotatedImageData] = useState(null),
    [lastRotationTime, setLastRotationTime] = useState(0);

  const onImageDataLoaded = (imageData) => {
    setSelectedImageData(imageData);
  };

  const onRotate = (angle) => {
    if (!selectedImageData) {
      return alert(`Please select an image first`);
    }

    try {
      const radians = parseFloat((angle * (Math.PI / 180)).toFixed(2));

      const start = performance.now(),
        rotator = new Rotator(),
        result = rotator.rotate(selectedImageData, radians),
        end = performance.now();

      setRotatedImageData(result);
      
      onImageRotated(end - start);
    } catch (error) {
      alert(error.message);
    }
  }

  const onImageRotated = (time) => {
    setLastRotationTime(parseInt(time));
  };

  return (
    <div className="App">
      <h1>Rotate Image</h1> 
      <ImagePicker onImageDataLoaded={onImageDataLoaded} />
      <Rotation onRotate={onRotate}></Rotation>
      <ImageDisplay title="Selected Image" imageData={selectedImageData} /> 
      <ImageDisplay title="Rotated Image" subtitle={lastRotationTime > 0 ? `(Took ${lastRotationTime} ms)` : ""} imageData={rotatedImageData} /> 
    </div>
  );
}

export default App;
