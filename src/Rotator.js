const PI = parseFloat(Math.PI.toFixed(2)),
  TWO_PI = parseFloat((PI * 2.0).toFixed(2)),
  PI_BY_TWO = parseFloat((PI / 2.0).toFixed(2));

class Rotator {
  /* 
   * Rotate Point
   *
   * This method takes a point, translates it to the given
   * center, rotates it on the given angle, and translates it
   * back from the center
   */

  _rotatePoint(pointX, pointY, centerX, centerY, sinAngle, cosAngle) {
    pointX -= centerX;
    pointY -= centerY;

    const rotatedX = (pointX * cosAngle) - (pointY * sinAngle),
      rotatedY = (pointX * sinAngle) + (pointY * cosAngle);

    pointX = rotatedX + centerX;
    pointY = rotatedY + centerY;

    return { x: parseInt(pointX), y: parseInt(pointY) };
  }

  /* 
   * Calculate Dimensions
   *
   * This method caluclates the dimensions of a rectangle
   * after being rotated around the given angle
   */

  _calculateDimensions(width, height, angle) {
    const sinValueForAngle = Math.sin(angle),
      sinValueForAngleSupplement = Math.sin(PI_BY_TWO - angle);

    const w = Math.round((width * Math.abs(sinValueForAngleSupplement)) + (height * Math.abs(sinValueForAngle))),
      h = Math.round((height * Math.abs(sinValueForAngleSupplement)) + (width * Math.abs(sinValueForAngle)));

    return { width: w, height: h };
  }

  /* 
   * Rotate (Private)
   *
   * This method takes the array data, width, and height of a source image,
   * and an angle by which it is to be rotated.
   * 
   * It calculates the target dimensions of the rotated image based on the angle,
   * and instantiates another array to hold the rotated image data.
   * 
   * It then sequentially reads the source image data, maps every 4 blocks to a pixel
   * location, rotates it, and then maps it to the target location
   */

  _rotate(data, width, height, angle) {
    const targetDimensions = this._calculateDimensions(width, height, angle),
      deltaX = parseInt((targetDimensions.width - width) / 2.0),
      deltaY = parseInt((targetDimensions.height - height) / 2.0),
      targetLineWidth = targetDimensions.width * 4,
      targetData = new Uint8ClampedArray(targetLineWidth * targetDimensions.height);

    const centerX = Math.trunc(width / 2),
      centerY = Math.trunc(height / 2),
      sinValueForAngle = parseFloat(Math.sin(angle).toFixed(2)),
      cosValueForAngle = parseFloat(Math.cos(angle).toFixed(2));

    const sourceLineWidth = width * 4;

    let row = 0;

    for (let i = 0, l = sourceLineWidth * height; i < l;) {
      const x = parseInt((i % sourceLineWidth) / 4),
        y = row;

      const rotatedPoint = this._rotatePoint(x, y, centerX, centerY, sinValueForAngle, cosValueForAngle);
      rotatedPoint.x += deltaX;
      rotatedPoint.y += deltaY;

      if (rotatedPoint.x >= 0 && rotatedPoint.x < targetDimensions.width && rotatedPoint.y >= 0 && rotatedPoint.y < targetDimensions.height) {
        const target = (rotatedPoint.y * targetLineWidth) + (rotatedPoint.x * 4)

        targetData[target] = data[i];
        targetData[target + 1] = data[i+1];
        targetData[target + 2] = data[i+2];
        targetData[target + 3] = data[i+3];
      }

      i += 4;

      if (i % sourceLineWidth === 0) {
        row++;
      }
    }

    return { data: targetData, width: targetDimensions.width, height: targetDimensions.height };
  }

  /* 
   * Rotate (Public)
   *
   * This method takes an ImageData object and an angle.
   * It verifies that the arguments are valid.
   * Once verified, it calls the internal rotate method,
   * and returns the rotated image data and dimensions as
   * a new ImageData object.
   */

  rotate(image, angle) {
    if (typeof image !== 'object' || !image.data || !image.width || !image.height) {
      throw new Error('Invalid ImageData provided');
    }

    const dataPixelCount = image.data.length / 4.0,
      pixelCount = image.width * image.height;

    if (dataPixelCount !== pixelCount) {
      throw new Error('Image data and dimensions do not match');
    }

    if (typeof angle !== 'number') {
      throw new Error('Angle must be a number');
    }

    const roundedAngle = parseFloat(angle.toFixed(2));
    
    if (Math.abs(roundedAngle) % TWO_PI === 0.00) {
      return image;
    }

    const { data, width, height } = image,
      result = this._rotate(data, width, height, angle);
    
    return new ImageData(Uint8ClampedArray.from(result.data), result.width, result.height);
  }
}

export default Rotator;