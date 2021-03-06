var bounds, coins, health, tiles, buttons, ui, towerToPlace, timeScale, nthWave, hasHad69, viewWindow, seed
var gridOffset = [0, 0]
var gridScale = 1

function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
    h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function game() {
  this.enter = () => {
    background(255);
    // strokeJoin(ROUND);
    strokeJoin(MITER);
    strokeCap(SQUARE);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    seeds = cyrb128(new Date().getTime().toString())
    randomSeed(seeds[0])
    noiseSeed(seeds[1])

    let amtDone = 0;
    do {
      amtDone += random(PI / 16, PI / 4);
      portalChunks.push(min(amtDone, PI))
    } while (amtDone <= PI)

    gridOffset = [0, 0];
    gridScale = 1;
    bounds = [[0, 0],[0, 0]]

    viewWindow = {
      "center": [0, 0],
      "width": [],
      "height": []
    }

    coins = 150
    health = 10

    towerToPlace = "Arrow Tower"
    timeScale = 1
    nthWave = 0;

    hasHad69 = false
    
    gridOffset = [Math.round(width / 2), Math.round(height / 2)];
    document.body.addEventListener("contextmenu", (e) => {
      e.preventDefault()
    })
    tiles = new TileManager()
    buttons = new ButtonManager(tiles)
    ui = new UI(enemyTypes, buttons)
  }
  
  this.draw = () => {
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

    if (health <= 0) {
      mgr.showScene(died)
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

    fill(COLORS.grass((mouseX - gridOffset[0]) / gridScale + TILE_SIZE / 2, (mouseY - gridOffset[1]) / gridScale + TILE_SIZE / 2))
    circle((mouseX - gridOffset[0]) / gridScale, (mouseY - gridOffset[1]) / gridScale - 15, 10)
    fill(0)
    circle((mouseX - gridOffset[0]) / gridScale, (mouseY - gridOffset[1]) / gridScale, 5)
    text(`${Math.round((mouseX - gridOffset[0]) / gridScale + TILE_SIZE / 2)}, ${Math.round((mouseY - gridOffset[1]) / gridScale + TILE_SIZE / 2)}`, (mouseX - gridOffset[0]) / gridScale, (mouseY - gridOffset[1]) / gridScale + 15)
    pop();
    ui.show()
    buttons.show(false)

    let minX = -(tiles.numTiles[3] - 1) * TILE_SIZE;
    let maxX = width + (tiles.numTiles[2] - 1) * TILE_SIZE;
    let minY = -(tiles.numTiles[1] - 1) * TILE_SIZE;
    let maxY = height + (tiles.numTiles[0] - 1) * TILE_SIZE;

    bounds = [[minX, maxX],[minY, maxY]]
  }
}

function scroll(event) {
  if (mgr.isCurrent(game)) {
    gridScale += (event.deltaY * -0.01);
    gridScale = constrain(gridScale, 0.25, 2);
  }
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