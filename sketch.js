var gridOffset = [0, 0];
var gridScale = 1;

var cellSize = 25;
var tileSize = 8;
var bounds = [[0, 0],[0, 0]]

var tiles = new TileManager()
var buttons = new ButtonManager(tiles)

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  // strokeJoin(BEVEL);
  strokeCap(SQUARE);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  gridOffset = [Math.round(width / 2), Math.round(height / 2)];
  // randomize();
}

function draw() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  background(255);
  
  if (mouseIsPressed) {
    drag();
  }

  push();
  translate(gridOffset[0], gridOffset[1]);
  tiles.show()
  drawGrid();
  buttons.show()
  circle(0, 0, 5)

  // for (let i = 0; i < tiles.length; i++) {
  //   if (isEntrance(tiles[i]["location"])) {
  //     findPath(tiles[i]["location"], isEntrance(tiles[i]["location"]))
  //     break
  //   }
  // }
  pop();

  let minX = -(tiles.numTiles[3] - 1) * tileSize * cellSize;
  let maxX = width + (tiles.numTiles[2] - 1) * tileSize * cellSize;
  let minY = -(tiles.numTiles[1] - 1) * tileSize * cellSize;
  let maxY = height + (tiles.numTiles[0] - 1) * tileSize * cellSize;

  bounds = [[minX, maxX],[minY, maxY]]

  // push()
  // stroke(255,0,0);
  // circle(0, 0, 5);
  // circle(gridOffset[0], gridOffset[1], 5);
  // line(0, 0, gridOffset[0], gridOffset[1])
  // pop()
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
  strokeWeight(1);
  drawGridlines(cellSize, viewStart, viewEnd, [0, 0]);

  strokeWeight(2);
  drawGridlines(cellSize * tileSize, viewStart, viewEnd, [cellSize * tileSize / 2, cellSize * tileSize / 2]);

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
  gridOffset[0] = gridOffset[0] + movedX;
  gridOffset[1] = gridOffset[1] + movedY;
  gridOffset[0] = constrain(gridOffset[0], bounds[0][0],  bounds[0][1]);
  gridOffset[1] = constrain(gridOffset[1], bounds[1][0],  bounds[1][1]);
  // gridOffset[0] = constrain(gridOffset[0], -tileSize * cellSize * 1.5, tileSize * cellSize * 1.5);
  // gridOffset[1] = constrain(gridOffset[1], -tileSize * cellSize * 1.5, tileSize * cellSize * 1.5);
}