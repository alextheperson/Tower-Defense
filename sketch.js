var gridOffset = [0, 0];
var gridScale = 1;
var bounds = [[0, 0],[0, 0]]

var viewWindow = {
  "center": [0, 0],
  "width": [],
  "height": []
}

var coins = 150
var health = 10

var tiles, buttons, ui

var towerToPlace = "Arrow Tower"
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
  COLORS.init()
  gridOffset = [Math.round(width / 2), Math.round(height / 2)];
  document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault()
  })
  tiles = new TileManager()
  buttons = new ButtonManager(tiles)
  ui = new UI(enemyTypes, buttons)
}

function draw() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  background(255);

  // frameRate(60 * max(min(1, timeScale), 0))
  
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
  scale(gridScale)
  drawGrid();
  if (timeScale >= 1) {
    for (let i = 0; i < max(timeScale, 1); i++) {
      tiles.show(true)
    }
  } else {
    if (frameCount % (1 / timeScale) == 0) {
      tiles.show(true)
    } else {
      tiles.show(false)
    }
  }
  buttons.show(true)
  pop();
  push()
  fill(COLORS.fadeGrass(0));
  circle(10, 50, 20)
  fill(COLORS.fadeGrass(0.25));
  circle(10, 75, 20)
  fill(COLORS.fadeGrass(0.5));
  circle(10, 100, 20)
  fill(COLORS.fadeGrass(0.75));
  circle(10, 125, 20)
  fill(COLORS.fadeGrass(1));
  circle(10, 150, 20)
  pop()
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
  gridScale = constrain(gridScale, 0.25, 2);
}

function drawGrid() {
  let viewStart = [-gridOffset[0] * (1 / gridScale), -gridOffset[1] * (1 / gridScale)];
  let viewEnd = [(-gridOffset[0] + width) * (1 / gridScale), (-gridOffset[1] + height) * (1 / gridScale)];
  
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