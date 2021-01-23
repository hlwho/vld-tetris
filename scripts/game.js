// CONFIGURATION VALUES
// in the same js file as other code because
// dynamically loading and forcing the loaded script to execute is messy
// and ES6 modules standard is overkill for this (intentionally vanilla) project
const PIXELSIZE = 20;
const GAME_WIDTH = 16; // 10
const GAME_HEIGHT = 20;

// record block indices for each rotation of each block shape
// imagining each block existing in a 4 x 4 square at the upper left-most
// corner of the game board
// i.e. the origin of each block occurs at pixelLst[0] wrt to the block indices
const sBlock = [
  [GAME_WIDTH, 1 + GAME_WIDTH, 1 + 2 * GAME_WIDTH, 2 + 2 * GAME_WIDTH],
  [2, 1 + GAME_WIDTH, 2 + GAME_WIDTH, 1 + 2 * GAME_WIDTH]
];
const tBlock = [
  [1, GAME_WIDTH, 1 + GAME_WIDTH, 2 + GAME_WIDTH],
  [1, 1 + GAME_WIDTH, 2 + GAME_WIDTH, 1 + 2 * GAME_WIDTH],
  [GAME_WIDTH, 1 + GAME_WIDTH, 2 + GAME_WIDTH, 1 + 2 * GAME_WIDTH],
  [1, GAME_WIDTH, 1 + GAME_WIDTH, 1 + 2 * GAME_WIDTH]
];
const jBlock = [
  [1, 2, 1 + GAME_WIDTH, 1 + 2 * GAME_WIDTH],
  [GAME_WIDTH, 1 + GAME_WIDTH, 2 + GAME_WIDTH, 2 + 2 * GAME_WIDTH],
  [1, 1 + GAME_WIDTH, 2 * GAME_WIDTH, 1 + 2 * GAME_WIDTH],
  [GAME_WIDTH, 2 * GAME_WIDTH, 1 + 2 * GAME_WIDTH, 2 + 2 * GAME_WIDTH]
];
const iBlock = [
  [1, 1 + GAME_WIDTH, 1 + 2 * GAME_WIDTH, 1 + 3 * GAME_WIDTH, 1 + 4 * GAME_WIDTH],
  [GAME_WIDTH, 1 + GAME_WIDTH, 2 + GAME_WIDTH, 3 + GAME_WIDTH]
];
const oBlock = [
  [0, 1, GAME_WIDTH, 1 + GAME_WIDTH]
];
const blocks = [sBlock, tBlock, jBlock, iBlock, oBlock];
var blockStyleClasses = ['s-block', 't-block', 'j-block', 'i-block', 'o-block']
for (let i = 0; i < blockStyleClasses.length; i++) {
  blockStyleClasses[i] = ['block', blockStyleClasses[i]];
}
const BLOCK_BORDER_WIDTH = 2;



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
  document.createTextNode('.pixel { \
    width: ' + PIXELSIZE.toString() + 'px; \
    height: ' + PIXELSIZE.toString() + 'px; }')
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

// prepare tetris blocks
dynamicStyle.appendChild(
  document.createTextNode('.block { \
    width: ' + (PIXELSIZE - 2 * BLOCK_BORDER_WIDTH).toString() + 'px; \
    height: ' + (PIXELSIZE - 2 * BLOCK_BORDER_WIDTH).toString() + 'px; \
    border-width: ' + BLOCK_BORDER_WIDTH.toString() + 'px; }')
);

/**
* Draw block onto the gameBoard pixels (pixelLst) at location loc
* and using the style classes in styleList
* @param {number} loc the index of the location to start drawing at
* @param {number array} block the pixel indices of the shape to draw
* @param {string array} styleList the list of css classes to style blockRot with
*/
function draw(loc, block, styleList) {
  block.forEach(idx => {
    p = pixelLst[loc + idx];
    styleList.forEach(sc => {
      p.classList.add(sc);
    });
  });

}

function testBlocks(row, blockRots, styleList) {
  blockRots.forEach((block, i) => {
    draw(row + i * 4, block, styleList);
  });

}

blocks.forEach((blockRots, i) => {
  testBlocks(i * 4 * GAME_WIDTH, blockRots, blockStyleClasses[i]);
});


console.log('clear 41:02');
