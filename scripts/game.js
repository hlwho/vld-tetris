// initialize game board
const PIXELSIZE = 20;
const WIDTH = 10;
const HEIGHT = 20;

var gameBoard = document.getElementById('game-board');
gameBoard.style.width = (WIDTH * PIXELSIZE).toString() + "px";
gameBoard.style.height = (HEIGHT * PIXELSIZE).toString() + "px";

// inserting rule into existing stylesheet doesn't work with Chrome
// when running locally, possibly because of CORS
// so create and use internal sheet
var dynamicStyle = document.createElement("style");
dynamicStyle.appendChild(
  document.createTextNode(".pixel { \
    width: " + PIXELSIZE.toString() + "px; \
    height: " + PIXELSIZE.toString() + "px; }")
);
document.head.appendChild(dynamicStyle);

for (var i = 0; i < WIDTH * HEIGHT; i++) {
  var pixel = document.createElement('div');
  pixel.classList.add('pixel');
  gameBoard.appendChild(pixel);
}
console.log('clear');
