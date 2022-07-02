function tracePath(x, y, points) {
  push()
  // stroke(COLORS.path(0, 0));
  // strokeWeight(CELL_WIDTH * 0.75);
  // noFill();
  // beginShape();
  // for (let i = 0; i < points.length; i++) {
  //   let currTile = points[i];
  //   vertex(currTile[0] * CELL_WIDTH + CELL_WIDTH / 2, currTile[1] * CELL_WIDTH + CELL_WIDTH / 2);
  // }
  // endShape()
  rectMode(CORNER)
  noStroke()
  for (let i = 0; i < points.length - 1; i++) {
    let currTile = points[i];
    let nextTile = points[i + 1];
    let deltaX = nextTile[0] - currTile[0]
    let deltaY = nextTile[1] - currTile[1]

    // console.log(deltaX, deltaY)
    
    for (let j = 0; j < max(Math.abs(deltaX), Math.abs(deltaY)) + 1; j++) {
      fill(COLORS.path((currTile[0] + Math.sign(deltaX) * j) * CELL_WIDTH + x * TILE_SIZE, (currTile[1] + Math.sign(deltaY) * j) * CELL_WIDTH + y * TILE_SIZE));
      square((currTile[0] + Math.sign(deltaX) * j) * CELL_WIDTH, (currTile[1] + Math.sign(deltaY) * j) * CELL_WIDTH, CELL_WIDTH)
      // console.log((currTile[0] + Math.sign(deltaX)), (currTile[1] + Math.sign(deltaY)))
    }
  }
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
    noStroke()
    rectMode(CORNER)
    for (let i = 0; i < TILE_WIDTH; i++) {
      for (let j = 0; j < TILE_WIDTH; j++) {
        fill(COLORS.grass(this.location.x * TILE_SIZE + i * CELL_WIDTH, this.location.y * TILE_SIZE + j * CELL_WIDTH));
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
    if (this.top != undefined) tracePath(this.location.x, this.location.y, this.top.concat([this.center]));
    if (this.bottom != undefined) tracePath(this.location.x, this.location.y, this.bottom.concat([this.center]));
    if (this.left != undefined) tracePath(this.location.x, this.location.y, this.left.concat([this.center]));
    if (this.right != undefined) tracePath(this.location.x, this.location.y, this.right.concat([this.center]));
    pop()

    push()
    if (gridScale < 0.5) {
      noStroke()
    } else if (gridScale < 0.75) {
      strokeWeight(1)
      stroke(0, map(gridScale, 0.5, 0.75, 20, 255))
    } else {
      strokeWeight(2)
      stroke(0, 255)
    }
    
    for (let i = 0; i < 9; i++) line(0, i * CELL_WIDTH, 8 * CELL_WIDTH, i * CELL_WIDTH)
    for (let i = 0; i < 9; i++) line(i * CELL_WIDTH, 0, i * CELL_WIDTH, 8 * CELL_WIDTH)
    pop()
    
    if (this.tower) {
      push();
      translate(this.center[0] * CELL_WIDTH + CELL_WIDTH / 2, this.center[1] * CELL_WIDTH + CELL_WIDTH / 2)
      scale(CELL_WIDTH)
      
      fill(100)
      strokeWeight(2 / CELL_WIDTH)
      stroke(0)
      beginShape()
      vertex(0.25, -1)
      vertex(0.25, -1.25)
      vertex(1.25, -1.25)
      vertex(1.25, 1.25)
      vertex(-1.25, 1.25)
      vertex(-1.25, -1.25)
      vertex(-0.25, -1.25)
      vertex(-0.25, -1)
      vertex(-1, -1)
      vertex(-1, 1)
      vertex(1, 1)
      vertex(1, -1)
      endShape(CLOSE)
      circle(-1.15, -1.15, 0.5)
      circle(1.15, -1.15, 0.5)
      circle(1.15, 1.15, 0.5)
      circle(-1.15, 1.15, 0.5)
      pop();
    }
    
    if (this.portal) {
      push();
      fill(COLORS.portal);
      stroke(COLORS.path);
      strokeWeight(3)
      circle(this.center[0] * CELL_WIDTH + CELL_WIDTH / 2, this.center[1] * CELL_WIDTH + CELL_WIDTH / 2, CELL_WIDTH);
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
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1])) {
          isOn = true;
        }
      }
    }
    if (this.bottom) {
      let tempPath = this.bottom.concat([this.center])
      for (let i = 0; i < tempPath.length - 1; i++) {
        let currPos = tempPath[i]
        let nextPos = tempPath[i+1]
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1])) {
          isOn = true;
        }
      }
    }
    if (this.left) {
      let tempPath = this.left.concat([this.center])
      for (let i = 0; i < tempPath.length - 1; i++) {
        let currPos = tempPath[i]
        let nextPos = tempPath[i+1]
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1])) {
          isOn = true;
        }
      }
    }
    if (this.right) {
      let tempPath = this.right.concat([this.center])
      for (let i = 0; i < tempPath.length - 1; i++) {
        let currPos = tempPath[i]
        let nextPos = tempPath[i+1]
        if (x <= max(currPos[0], nextPos[0]) && x >= min(currPos[0], nextPos[0]) && y <= max(currPos[1], nextPos[1]) && y >= min(currPos[1], nextPos[1])) {
          isOn = true;
        }
      }
    }
    if (this.tower) {
      if (x <= this.center[0] + 1 && x >= this.center[0] - 1 && y <= this.center[1] + 1 && y >= this.center[1] - 1) {
        isOn = true;
      }
    }
    return isOn;
  }

  generateTile(x, y) {
    let neighbors = [this.tiles.tile(x, y - 1), this.tiles.tile(x, y + 1), this.tiles.tile(x - 1, y), this.tiles.tile(x + 1, y)]
    let neighborPaths = [neighbors[0]["bottom"] != undefined, neighbors[1]["top"] != undefined, neighbors[2]["right"] != undefined, neighbors[3]["left"] != undefined]
    let center = [randInt(1, 7), randInt(1, 7)]
  
    this.center = center

    let hasSecondPath = false;
    let extraPaths = 0;
    let numRequiredPaths = 0;
  
    do {
      if (neighborPaths[0]) {
        this.top = [[neighbors[0].bottom[0][0], 0]]
        this.top[1] = [this.top[0][0], randInt(this.top[0][1] + 1, center[1])]
        this.top[2] = [center[0], this.top[1][1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[0] == -1) {
        this.top = [[randInt(0, 7), 0]]
        this.top[1] = [this.top[0][0], randInt(this.top[0][1] + 1, center[1])]
        this.top[2] = [center[0], this.top[1][1]]
        hasSecondPath = true;
      }
      if (neighborPaths[1]) {
        this.bottom = [[neighbors[1].top[0][0], 7]]
        this.bottom[1] = [this.bottom[0][0], randInt(this.bottom[0][1] - 1, center[1])]
        this.bottom[2] = [center[0], this.bottom[1][1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[1] == -1) {
        this.bottom = [[randInt(0, 7), 7]]
        this.bottom[1] = [this.bottom[0][0], randInt(this.bottom[0][1] - 1, center[1])]
        this.bottom[2] = [center[0], this.bottom[1][1]]
        hasSecondPath = true;
      }
      if (neighborPaths[2]) {
        this.left = [[0, neighbors[2].right[0][1]]]
        // this.left[1] = [Math.round(map(Math.random(), 0, 1, this.left[0][0] + 1, center[0])), this.left[0][1]]
        this.left[1] = [randInt(this.left[0][0] + 1, center[0]), this.left[0][1]]
        this.left[2] = [this.left[1][0], center[1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[2] == -1) {
        this.left = [[0, randInt(0, 7)]]
        this.left[1] = [randInt(this.left[0][0] + 1, center[0]), this.left[0][1]]
        this.left[2] = [this.left[1][0], center[1]]
        hasSecondPath = true;
      }
      if (neighborPaths[3]) {
        this.right = [[7, neighbors[3].left[0][1]]]
        this.right[1] = [randInt(this.right[0][0] - 1, center[0]), this.right[0][1]]
        this.right[2] = [this.right[1][0], center[1]]
        numRequiredPaths += 1;
      } else if (randBool() && neighbors[3] == -1) {
        this.right = [[7, randInt(0, 7)]]
        this.right[1] = [randInt(this.right[0][0] - 1, center[0]), this.right[0][1]]
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