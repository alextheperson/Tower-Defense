function tracePath(points) {
  noFill();
  beginShape();
  for (let i = 0; i < points.length; i++) {
    let currTile = points[i];
    vertex(currTile[0] * cellSize, currTile[1] * cellSize);
  }
  endShape();
  // Add join at center
  push()
  noStroke()
  fill(COLORS["path"][0], COLORS["path"][1], COLORS["path"][2])
  translate(points[points.length - 1][0] * cellSize, points[points.length - 1][1] * cellSize);
  square(0, 0, cellSize / 2)
  pop()
}

class Tile {
  constructor (tileManager, pos, json) {
    this.tiles = tileManager
    this.location = {"x": pos[0], "y": pos[1]}
    this.enemies = []
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
    }
  }

  show() {
    push();
    translate(this.location.x * cellSize * tileSize, this.location.y * cellSize * tileSize);
    fill(COLORS["grass"][0], COLORS["grass"][1], COLORS["grass"][2]);
    square(0, 0, cellSize * tileSize);
    if (mouseX - gridOffset[0] > this.location.x * cellSize * tileSize - cellSize * tileSize / 2 &&
        mouseX - gridOffset[0] < this.location.x * cellSize * tileSize + cellSize * tileSize / 2 &&
        mouseY - gridOffset[1] > this.location.y * cellSize * tileSize - cellSize * tileSize / 2 &&
        mouseY - gridOffset[1] < this.location.y * cellSize * tileSize + cellSize * tileSize / 2) {
      if (mouseIsPressed) {
        this.enemies.push(new Enemy(this.tiles, this.path))
        console.log(
          this.path
        )
      }
      push()
      noFill()
      stroke(200, 255, 200)
      strokeWeight(5);
      square(0, 0, cellSize * tileSize - 3);
      pop()
    }
    translate(-cellSize * tileSize / 2, -cellSize * tileSize / 2);

    push()
    stroke(COLORS["path"][0], COLORS["path"][1], COLORS["path"][2]);
    strokeWeight(cellSize / 2);
    if (this.top != undefined) tracePath(this.top.concat([this.center]));
    if (this.bottom != undefined) tracePath(this.bottom.concat([this.center]));
    if (this.left != undefined) tracePath(this.left.concat([this.center]));
    if (this.right != undefined) tracePath(this.right.concat([this.center]));
    pop()
    
    if (this.tower) {
      push();
      fill(0);
      noStroke();
      circle(4 * cellSize, 5.5 * cellSize, cellSize * 1.5);
      pop();
    }
    
    if (this.portal) {
      push();
      fill(COLORS.portal[0], COLORS.portal[1], COLORS.portal[2]);
      stroke(COLORS["path"][0], COLORS["path"][1], COLORS["path"][2]);
      strokeWeight(3)
      circle(this.center[0] * cellSize, this.center[1] * cellSize, cellSize);
      pop();
    }
    pop()
    push()
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].show();
    }
    pop()
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