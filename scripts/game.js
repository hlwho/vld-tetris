// initialize game board
const WIDTH = 10;
const HEIGHT = 20;
for (var i = 0; i < WIDTH * HEIGHT; i++) {
  var pixel = document.createElement('div');
  pixel.classList.add('test-div');
  document.body.appendChild(pixel);
}
console.log('clear');
