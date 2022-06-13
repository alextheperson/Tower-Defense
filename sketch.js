var gridOffset = [0, 0];
var gridScale = 1;
var bounds = [[0, 0],[0, 0]]

var coins = 100
var health = 10

var tiles = new TileManager()
var buttons = new ButtonManager(tiles)
var ui = new UI(enemyTypes, buttons)

var towerToPlace = "arrow"
var timeScale = 1
var nthWave = 0;

var hasHad69 = false

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  strokeJoin(ROUND);
  strokeCap(SQUARE);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  gridOffset = [Math.round(width / 2), Math.round(height / 2)];
  document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault()
  })
}

function draw() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  background(255);

  frameRate(60 * max(min(1, timeScale), 0))
  
  document.body.style.cursor = "-webkit-grab"
  document.body.style.cursor = "grab"
  
  if (mouseIsPressed && mouseButton === LEFT) {
    document.body.style.cursor = "-webkit-grabbing"
    document.body.style.cursor = "grabbing"
    drag();
  }

  if (coins == 69 && !hasHad69) {
    hasHad69 = true
    alert("You have 69 coins\nNice!")
  }

  push();
  translate(gridOffset[0], gridOffset[1]);
  drawGrid();
  tiles.show()
  buttons.show(true)
  pop();
  ui.show()
  buttons.show(false)

  let minX = -(tiles.numTiles[3] - 1) * TILE_SIZE;
  let maxX = width + (tiles.numTiles[2] - 1) * TILE_SIZE;
  let minY = -(tiles.numTiles[1] - 1) * TILE_SIZE;
  let maxY = height + (tiles.numTiles[0] - 1) * TILE_SIZE;

  bounds = [[minX, maxX],[minY, maxY]]

  if (key == "1") tool = "pan"
  if (key == "2") tool = "place"
}

function randBool() {
  return Math.random() > 0.5
}

function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

function mouseWheel(event) {
  gridScale += (event.delta * -0.01);
  gridScale = constrain(gridScale, 0.5, 2);
}

function drawGrid() {
  let viewStart = [-gridOffset[0], -gridOffset[1]];
  let viewEnd = [(viewStart[0] + width), (viewStart[1] + height)];
  
  push();
  stroke(0);
  // strokeWeight(1);
  // drawGridlines(CELL_WIDTH, viewStart, viewEnd, [0, 0]);

  strokeWeight(2);
  drawGridlines(TILE_SIZE, viewStart, viewEnd, [TILE_SIZE / 2, TILE_SIZE / 2]);

  pop();
}

function drawGridlines(depth, start, end, offset) {
  for (let i = start[0]; i < end[0]; i++) {
    j = Math.round(i);
    if ((j + offset[0]) % depth == 0) {
      line(j, start[1], j, end[1])
    }
  }
  for (let i = start[1]; i < end[1]; i++) {
    j = Math.round(i);
    if ((j + offset[1]) % depth == 0) {
      line(start[0], j, end[0], j)
    }
  }
}

function drag() {
  gridOffset[0] = gridOffset[0] + movedX * 2;
  gridOffset[1] = gridOffset[1] + movedY * 2;
  gridOffset[0] = constrain(gridOffset[0], bounds[0][0],  bounds[0][1]);
  gridOffset[1] = constrain(gridOffset[1], bounds[1][0],  bounds[1][1]);
  // gridOffset[0] = constrain(gridOffset[0], -TILE_SIZE * 1.5, TILE_SIZE * 1.5);
  // gridOffset[1] = constrain(gridOffset[1], -TILE_SIZE * 1.5, TILE_SIZE * 1.5);
}