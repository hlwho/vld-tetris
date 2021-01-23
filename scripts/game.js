// CONFIGURATION VALUES
// in the same js file as other code because
// dynamically loading and forcing the loaded script to execute is messy
// and ES6 modules standard is overkill for this (intentionally vanilla) project
const PIXELSIZE = 20;
const GAME_WIDTH = 10;
const GAME_HEIGHT = 20;

// initialize game board
const gameBoard = document.getElementById('game-board');
gameBoard.style.width = (GAME_WIDTH * PIXELSIZE).toString() + "px";
gameBoard.style.height = (GAME_HEIGHT * PIXELSIZE).toString() + "px";

// inserting css rule into existing stylesheet doesn't work with Chrome
// when running locally, possibly because of CORS
// so create and use internal sheet to alter pixel class
const dynamicStyle = document.createElement("style");
document.head.appendChild(dynamicStyle);
dynamicStyle.appendChild(
  document.createTextNode(".pixel { \
    width: " + PIXELSIZE.toString() + "px; \
    height: " + PIXELSIZE.toString() + "px; }")
);
var pixelLst = [];
for (let i = 0; i < GAME_WIDTH * GAME_HEIGHT; i++) {
  let pixel = document.createElement('div');
  pixel.classList.add('pixel');
  gameBoard.appendChild(pixel);
  pixelLst.push(pixel);
}

const startPauseButton = document.getElementById('start-pause-button');
const score = document.getElementById('score');

// record block indices for each rotation of each block shape
// imagining each block existing in a 3 x 3 square at the upper left-most
// corner of the game board
// i.e. the origin of each block occurs at pixelLst[0] wrt to the block indices
const elBlock = [
  [1, 2, 1 + GAME_WIDTH, 1 + 2 * GAME_WIDTH],
  [GAME_WIDTH, 1 + GAME_WIDTH, 2 + GAME_WIDTH, 2 + 2 * GAME_WIDTH],
  [1, 1 + GAME_WIDTH, 2 * GAME_WIDTH, 1 + 2 * GAME_WIDTH],
  [GAME_WIDTH, 2 * GAME_WIDTH, 1 + 2 * GAME_WIDTH, 2 + 2 * GAME_WIDTH]
];

console.log('clear 35:29');
