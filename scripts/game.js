// CONFIGURATION VALUES
// in the same js file as other code because
// dynamically loading and forcing the loaded script to execute is messy
// and ES6 modules standard is overkill for this (intentionally vanilla) project
const PIXELSIZE = 20;
const GAME_WIDTH = 10;
const GAME_HEIGHT = 20;
const PLAYER_START_POS = Math.floor(GAME_WIDTH / 2);

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
const blockLst = [sBlock, tBlock, jBlock, iBlock, oBlock];
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
// divs representing 'pixels' on the game board
var pixelLst = [];
// gameBoardMap[i] == 1 if there is a block filling that pixel; 0 otherwise
var gameBoardMap = [];
for (let i = 0; i < GAME_WIDTH * GAME_HEIGHT; i++) {
  let pixel = document.createElement('div');
  pixel.classList.add('pixel');
  gameBoard.appendChild(pixel);
  pixelLst.push(pixel);
  gameBoardMap.push(0);
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
* @param {number} pos index of the position at which to start drawing
* @param {number array} block pixel indices of the block to draw
* @param {string array} styleList list of css classes with which to style block
*/
function draw(pos, block, styleList) {
  block.forEach(idx => {
    let p = pixelLst[pos + idx];
    styleList.forEach(sc => {
      p.classList.add(sc);
    });
  });
}

/**
* Erase block from the gameBoard pixels (pixelLst) at location loc
* by unusing the style classes in styleList
* @param {number} pos index of the position at which to start erasing
* @param {number array} block pixel indices of the block to erase
* @param {string array} styleList list of css classes with which block is styled
*/
function erase(pos, block, styleList) {
  block.forEach(idx => {
    let p = pixelLst[pos + idx];
    styleList.forEach(sc => {
      p.classList.remove(sc);
    });
  });
}


// Configure player
// idx of block currently under player control
var playerBlockIdx;
// idx of block's rotation
var playerBlockRot;
// position of player block on game board
var playerBlockPos;

/**
* Initialize block under player's control
*/
function newPlayerBlock() {
  playerBlockIdx = Math.floor(Math.random() * blockLst.length);
  playerBlockRot = 0;
  playerBlockPos = PLAYER_START_POS;
}


// Set up game logic
// interval ID which moves the player's block down
var playerGravity;

/**
* Reset game board map such that all pixels are marked as unoccupied
*/
function clearGameBoardMap() {
  for (let i = 0; i < gameBoardMap.length; i++) {
    gameBoardMap[i] = 0;
  }
}

/**
* Reset game board such that no pixel divs appear to be blocks
*/
function clearGameBoard() {
  // TODO: optimize runtime?
  for (let i = 0; i < pixelLst.length; i++) {
    let p = pixelLst[i];
    blockStyleClasses.forEach(lst => {
      lst.forEach(sc => {
        p.classList.remove(sc);
      });
    });
  }
}

/**
* End the game
*/
function gameOver() {
  clearInterval(playerGravity);
  clearGameBoardMap();
  console.log('GAME OVER');
}

/**
* True if the block is at the bottom of the game board or on top of another
* block; False otherwise
* @param {number} pos index of the position of the block to check
* @param {number array} block pixel indices of the block to check
*/
function blockLanded(pos, block) {
  let hitBottomOrBlock = block.some(bidx => {
    let nextPos = pos + bidx + GAME_WIDTH;
    return nextPos >= GAME_WIDTH * GAME_HEIGHT || gameBoardMap[nextPos];
  });
  return hitBottomOrBlock;
}

/**
* Mark the block as fixed on the game board map
* @param {number} pos index of the position of the block to mark as fixed
* @param {number array} block pixel indices of the block to mark as fixed
*/
function fixBlock(pos, block) {
  block.forEach(idx => {
    gameBoardMap[pos + idx] = 1;
  });
}

/**
* True if blocks have reached the top of the game board; False otherwise
* @param {number} pos index of the position of the last block placed
* @param {number array} block pixel indices of the last block placed
*/
function boardFilled(pos, block) {
  return block.some(bidx => { return pos + bidx < GAME_WIDTH; });
}

/**
* Game loop which handles moving the player-controlled block downwards
*/
function movePlayerDown() {
  let block = blockLst[playerBlockIdx][playerBlockRot];
  let switchBlock = blockLanded(playerBlockPos, block);
  if (switchBlock && boardFilled(playerBlockPos, block)) {
    gameOver();
  } else if (switchBlock) {
    fixBlock(playerBlockPos, block);
    newPlayerBlock();
    draw(playerBlockPos,
      blockLst[playerBlockIdx][playerBlockRot],
      blockStyleClasses[playerBlockIdx]);
  } else {
    let blockStyle = blockStyleClasses[playerBlockIdx];
    erase(playerBlockPos, block, blockStyle);
    playerBlockPos = playerBlockPos + GAME_WIDTH;
    draw(playerBlockPos, block, blockStyle);
  }
}

function startGame() {
  clearGameBoard();
  newPlayerBlock();
  playerGravity = setInterval(movePlayerDown, 500);
}

startGame();


console.log('clear 51:32');
