import React, { useState } from 'react';

import './Rotation.css';

function Rotation({ onRotate }) {
  const [angle, setAngle] = useState(0.0);

  const rotate = () => {
    onRotate(angle);
  }

  return (
    <div className="RotationContainer">
      <div className="RotationAngle">
        <label>Angle: </label>
        <input type="number" name="angle" step="1" defaultValue="0" onChange={e => setAngle(e.target.value)} />
        <label> degrees</label>
      </div>
      <div className="RotationButton">
        <button onClick={rotate}>Rotate!</button>
      </div>
    </div>
  );
}

export default Rotation;
