import React, { useState, useCallback } from 'react';

import './ImagePicker.css';

function ImagePicker({ onImageDataLoaded }) {
  const [canvas, setCanvas] = useState(null),
    setCanvasReference = useCallback(canvas => {
      setCanvas(canvas);
    }, []);

  const onImagePicked = event => {
    if (event.target.files.length === 0) {
      return;
    }

    const image = new Image();
    image.src = window.URL.createObjectURL(event.target.files[0])
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      
      const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

      onImageDataLoaded(imageData);
    }
  };

  return (
    <div className="ImagePickerContainer">
      <label>File: </label>
      <input type="file" name="image" accept="image/*" onChange={onImagePicked} />
      <canvas className="ImagePickerCanvas" ref={setCanvasReference} />
    </div>    
  );
}

export default ImagePicker;
