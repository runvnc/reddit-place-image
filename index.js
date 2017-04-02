// converted from https://github.com/stragulus/CaptureRedditPlace

const Jimp = require('jimp');
const fetch = require('fetch');
const getRange = require('get-range');

const bitmapURL = 'https://www.reddit.com/api/place/board-bitmap'; 
const BITMAP_WIDTH = 1000;
const BITMAP_HEIGHT = 1000;

const rgba = Jimp.rgbaToInt;

const COLOR_MAP = [
  rgba(255, 255, 255, 1),
  rgba(228, 228, 228, 1),
  rgba(136, 136, 136, 1),
  rgba(34, 34, 34, 1),
  rgba(255, 167, 209, 1),
  rgba(229, 0, 0, 1),
  rgba(229, 149, 0, 1),
  rgba(160, 106, 66, 1),
  rgba(229, 217, 0, 1),
  rgba(148, 224, 68, 1),
  rgba(2, 190, 1, 1),
  rgba(0, 211, 221, 1),
  rgba(0, 131, 199, 1),
  rgba(0, 0, 234, 1),
  rgba(207, 110, 228, 1),
  rgba(130, 0, 128, 1)
];

function processImageData(buffer, cb) {
  let img = new Jimp(BITMAP_WIDTH, BITMAP_HEIGHT, (err, image) => {
    let index = 4
    for (let y of getRange(BITMAP_HEIGHT)) {
      for (let x of getRange(BITMAP_WIDTH / 2)) {
        const pixelData = Math.round(buffer[index]);
        const pixel1 = pixelData >> 4;
        const pixel2 = pixelData & 0x0f;
        image.setPixelColor(COLOR_MAP[pixel1], x*2, y);
        image.setPixelColor(COLOR_MAP[pixel2], x*2+1, y);
        index += 1
      }
    }
    cb(image);
  });
}

exports.boardImage = () => {
  return new Promise( (res, rej) => { 
    fetch.fetchUrl(bitmapURL, (err, meta, body) => {
      if (err) return rej(err);
      processImageData(body, res);
    });
  });
}

exports.saveBoardImage = async (path) => {
  const img = await exports.boardImage();
  img.write(path);
}

