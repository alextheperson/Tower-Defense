function tracePath(points) {
  noFill();
  beginShape();
  for (let i = 0; i < points.length; i++) {
    let currTile = points[i];
    vertex(currTile[0] * CELL_WIDTH, currTile[1] * CELL_WIDTH);
  }
  endShape();
  // Add join at center
  push()
  noStroke()
  fill(COLORS.path)
  translate(points[points.length - 1][0] * CELL_WIDTH, points[points.length - 1][1] * CELL_WIDTH);
  circle(0, 0, CELL_WIDTH * 0.75)
  pop()
}

class Tile {
  constructor (tileManager, pos, json) {
    this.tiles = tileManager
    this.location = {"x": pos[0], "y": pos[1]}
    if (!json) {
      this.generateTile(pos[0], pos[1])
    } else {
      this.top = json["top"]
      this.bottom = json["bottom"]
      this.left = json["left"]
      this.right = json["right"]
      this.center = json["center"]
      this.tower = json["tower"]
      this.portal = json["portal"]
      this.path = json["path"]
      this.origin = json["origin"]
    }
  }

  show() {
    push();
    translate(this.location.x * TILE_SIZE - TILE_SIZE / 2, this.location.y * TILE_SIZE - TILE_SIZE / 2);
    // translate(this.location.x * TILE_SIZE, this.location.y * TILE_SIZE);
    // fill(COLORS.grass);
    push()
    rectMode(CORNER)
    for (let i = 0; i < TILE_WIDTH; i++) {
      for (let j = 0; j < TILE_WIDTH; j++) {
        fill(COLORS.fadeGrassLoc(this.location.x * TILE_SIZE + i * CELL_WIDTH, this.location.y * TILE_SIZE + j * CELL_WIDTH));
        square(i * CELL_WIDTH, j * CELL_WIDTH, CELL_WIDTH)
        // fill(255)
        // rectMode(CENTER)
        // textAlign(CENTER, CENTER)
        // rect(this.location.x * TILE_WIDTH + i * CELL_WIDTH, this.location.y * TILE_WIDTH + j * CELL_WIDTH, 75, 10)
        // fill(0)
        // text((this.location.x * TILE_WIDTH + i * CELL_WIDTH) + ", " + (this.location.y * TILE_WIDTH + j * CELL_WIDTH), this.location.x * TILE_WIDTH + i * CELL_WIDTH, this.location.y * TILE_WIDTH + j * CELL_WIDTH)
        // rectMode(CORNER)
      }
    }
    pop()
    // square(0, 0, TILE_SIZE);
    // translate(-TILE_SIZE / 2, -TILE_SIZE / 2);

    push()
    if (gridScale < 0.75) stroke(0, map(gridScale, 0.50, 0.75, 20, 255))
    else stroke(0, 255)
    
    for (let i = 1; i < 8; i++) line(0, i * CELL_WIDTH, 8 * CELL_WIDTH, i * CELL_WIDTH)
    for (let i = 1; i < 8; i++) line(i * CELL_WIDTH, 0, i * CELL_WIDTH, 8 * CELL_WIDTH)
    pop()
    
    push()
    stroke(COLORS.path);
    strokeWeight(CELL_WIDTH * 0.75);
    if (this.top != undefined) tracePath(this.top.concat([this.center]));
    if (this.bottom != undefined) tracePath(this.bottom.concat([this.center]));
    if (this.left != undefined) tracePath(this.left.concat([this.center]));
    if (this.right != undefined) tracePath(this.right.concat([this.center]));
    pop()
    
    if (this.tower) {
      push();
      fill(0);
      noStroke();
      circle(this.center[0] * CELL_WIDTH, this.center[1] * CELL_WIDTH, CELL_WIDTH);
      pop();
    }
    
    if (this.portal) {
      push();
      fill(COLORS.portal);
      stroke(COLORS.path);
      strokeWeight(3)
      circle(this.center[0] * CELL_WIDTH, this.center[1] * CELL_WIDTH, CELL_WIDTH);
      pop();
    }
    pop()
  }

  onPath(x, y) {
    let isOn = false;
    if (this.top) {
      let tempPath = this.top.concat([this.center])
      for (let i = 0; i < tempPath.length - 1; i++) {
        let currPos = tempPath[i]
        let nextPos = tempPath[i+1]
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) - 1 && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1]) - 1) {
          isOn = true;
            }
      }
    }
    if (this.bottom) {
      let tempPath = this.bottom.concat([this.center])
      for (let i = 0; i < tempPath.length - 1; i++) {
        let currPos = tempPath[i]
        let nextPos = tempPath[i+1]
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) - 1 && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1]) - 1) {
          isOn = true;
            }
      }
    }
    if (this.left) {
      let tempPath = this.left.concat([this.center])
      for (let i = 0; i < tempPath.length - 1; i++) {
        let currPos = tempPath[i]
        let nextPos = tempPath[i+1]
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) - 1 && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1]) - 1) {
          isOn = true;
            }
      }
    }
    if (this.right) {
      let tempPath = this.right.concat([this.center])
      for (let i = 0; i < tempPath.length - 1; i++) {
        let currPos = tempPath[i]
        let nextPos = tempPath[i+1]
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) - 1 && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1]) - 1) {
          isOn = true;
            }
      }
    }
    return isOn;
  }

  generateTile(x, y) {
    let neighbors = [this.tiles.tile(x, y - 1), this.tiles.tile(x, y + 1), this.tiles.tile(x - 1, y), this.tiles.tile(x + 1, y)]
    let neighborPaths = [neighbors[0]["bottom"] != undefined, neighbors[1]["top"] != undefined, neighbors[2]["right"] != undefined, neighbors[3]["left"] != undefined]
    let center = [Math.round(Math.random() * 6) + 1, Math.round(Math.random() * 6) + 1]
  
    this.center = center

    let hasSecondPath = false;
    let extraPaths = 0;
    let numRequiredPaths = 0;
  
    do {
      if (neighborPaths[0]) {
        this.top = [[neighbors[0].bottom[0][0], 0]]
        this.top[1] = [this.top[0][0], Math.round(map(Math.random(), 0, 1, this.top[0][1] + 1, center[1]))]
        this.top[2] = [center[0], this.top[1][1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[0] == -1) {
        this.top = [[Math.round(Math.random() * 6 + 1), 0]]
        this.top[1] = [this.top[0][0], Math.round(map(Math.random(), 0, 1, this.top[0][1] + 1, center[1]))]
        this.top[2] = [center[0], this.top[1][1]]
        hasSecondPath = true;
      }
      if (neighborPaths[1]) {
        this.bottom = [[neighbors[1].top[0][0], 8]]
        this.bottom[1] = [this.bottom[0][0], Math.round(map(Math.random(), 0, 1, this.bottom[0][1] - 1, center[1]))]
        this.bottom[2] = [center[0], this.bottom[1][1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[1] == -1) {
        this.bottom = [[Math.round(Math.random() * 6 + 1), 8]]
        this.bottom[1] = [this.bottom[0][0], Math.round(map(Math.random(), 0, 1, this.bottom[0][1] - 1, center[1]))]
        this.bottom[2] = [center[0], this.bottom[1][1]]
        hasSecondPath = true;
      }
      if (neighborPaths[2]) {
        this.left = [[0, neighbors[2].right[0][1]]]
        this.left[1] = [Math.round(map(Math.random(), 0, 1, this.left[0][0] + 1, center[0])), this.left[0][1]]
        this.left[2] = [this.left[1][0], center[1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[2] == -1) {
        this.left = [[0, Math.round(Math.random() * 6 + 1)]]
        this.left[1] = [Math.round(map(Math.random(), 0, 1, this.left[0][0] + 1, center[0])), this.left[0][1]]
        this.left[2] = [this.left[1][0], center[1]]
        hasSecondPath = true;
      }
      if (neighborPaths[3]) {
        this.right = [[8, neighbors[3].left[0][1]]]
        this.right[1] = [Math.round(map(Math.random(), 0, 1, this.right[0][0] - 1, center[0])), this.right[0][1]]
        this.right[2] = [this.right[1][0], center[1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[3] == -1) {
        this.right = [[8, Math.round(Math.random() * 6 + 1)]]
        this.right[1] = [Math.round(map(Math.random(), 0, 1, this.right[0][0] - 1, center[0])), this.right[0][1]]
        this.right[2] = [this.right[1][0], center[1]]
        hasSecondPath = true;
      }
      if (neighbors.indexOf(-1) == -1) {
        if (numRequiredPaths == 1) this.portal = true;
        break
      }
    } while (!hasSecondPath)
    this.path = {}
    let tempPath = []
    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i] != -1 && neighborPaths[i]) {
        tempPath.push({...neighbors[i].path})
      }
    }
    this.path[x + "," + y] = tempPath
  }
}