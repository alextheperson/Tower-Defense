class Enemy {
  constructor (tiles, restOfPath, side) {
    this.tiles = tiles;
    this.path = [Object.keys(restOfPath)[0].split(",")]
    let pathLeft = restOfPath[Object.keys(restOfPath)[0]]
    while (true) {
      let nextTile = pathLeft[Math.floor((Math.random()*pathLeft.length))];
      this.path.push(Object.keys(nextTile)[0].split(","))
      pathLeft = Object.values(nextTile)[0]
      if (Object.values(nextTile)[0] === "tower") break
    }
    console.log(this.path)
    this.pathProgress = 0;
    this.tilePath = side;
    this.tilePathProgress = 0;
    this.updateCooldown = 0;
  }

  show() {
    this.update()
    push()
    translate(this.path[this.pathProgress][0] * tileSize * cellSize - tileSize * cellSize / 2, this.path[this.pathProgress][1] * tileSize * cellSize - tileSize * cellSize / 2)
    let currentTile = this.tiles.tile(this.path[this.pathProgress][0], this.path[this.pathProgress][1])
    circle(currentTile[this.tilePath][this.tilePathProgress][0] * cellSize, currentTile[this.tilePath][this.tilePathProgress][1] * cellSize, 20)
    pop()
  }

  update() {
    let currentTile = this.tiles.tile(this.path[this.pathProgress][0], this.path[this.pathProgress][1])
    let currentPath = currentTile[this.tilePath]
    if (this.updateCooldown == 10) {
      this.updateCooldown = 0
      if (this.tilePathProgress < currentPath.length - 1) {
        this.tilePathProgress += 1
      }
      else {
        this.tilePathProgress = 0
      }
    } else {
      this.updateCooldown += 1
    }
  }
}