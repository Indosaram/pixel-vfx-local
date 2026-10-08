export function reconstructFrame(width, height, black, white, halfBlack) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    const ry = (height - 1 - y) * width;
    for (let x = 0; x < width; x++) {
      const i = (ry + x) * 4, q = (y * width + x) * 4;
      let al = Math.max(
        255 - (white[i] - black[i]),
        255 - (white[i + 1] - black[i + 1]),
        255 - (white[i + 2] - black[i + 2]));
      al = al < 0 ? 0 : al > 255 ? 255 : al;
      data[q + 3] = al;
      if (al > 0) {
        data[q] = halfBlack[i] * 255 / al;
        data[q + 1] = halfBlack[i + 1] * 255 / al;
        data[q + 2] = halfBlack[i + 2] * 255 / al;
      }
    }
  }
  return { w: width, h: height, data };
}
