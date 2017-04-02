Get image for current reddit.com/r/place

`npm i -S reddit-place-image`

`boardImage()` and `saveBoardImage()` return promises.

```javascript
const place = require('reddit-place-image');

place.boardImage().then( (board) => {
  // manipulate with `jimp` npm package..
});

// or just save to bitmap file
place.saveBoardImage('place.bmp').catch(console.error);
```
