// CONFIGURATION VALUES
// in the same js file as other code because
// dynamically loading and forcing the loaded script to execute is messy
// and ES6 modules standard is overkill for this (intentionally vanilla) project
const PIXELSIZE = 20;
const GAME_WIDTH = 10;
const GAME_HEIGHT = 20;

// initialize game board
var gameBoard = document.getElementById('game-board');
gameBoard.style.width = (GAME_WIDTH * PIXELSIZE).toString() + "px";
gameBoard.style.height = (GAME_HEIGHT * PIXELSIZE).toString() + "px";

// inserting css rule into existing stylesheet doesn't work with Chrome
// when running locally, possibly because of CORS
// so create and use internal sheet to alter pixel class
var dynamicStyle = document.createElement("style");
document.head.appendChild(dynamicStyle);
dynamicStyle.appendChild(
  document.createTextNode(".pixel { \
    width: " + PIXELSIZE.toString() + "px; \
    height: " + PIXELSIZE.toString() + "px; }")
);
for (var i = 0; i < GAME_WIDTH * GAME_HEIGHT; i++) {
  var pixel = document.createElement('div');
  pixel.classList.add('pixel');
  gameBoard.appendChild(pixel);
}

console.log('clear');
