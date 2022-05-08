class Enemy {
  constructor (tiles, restOfPath, side) {
    this.tiles = tiles;
    this.restOfPath = restOfPath;
    this.pos = {"side": side, "node": 0, "toCenter": true}
    // console.log(restOfPath)
  }

  show() {
    this.update()
    let coords = Object.keys(this.restOfPath)[0].split(",")
    push()
    translate(coords[0] * cellSize * tileSize - cellSize * tileSize / 2, coords[1] * cellSize * tileSize - cellSize * tileSize / 2)
    console.log(coords, this.tiles.tile(coords[0], coords[1]), this.pos["side"])
    circle(this.tiles.tile(coords[0], coords[1])[this.pos["side"]][this.pos["node"]][0] * cellSize, this.tiles.tile(coords[0], coords[1])[this.pos["side"]][this.pos["node"]][1] * cellSize, 20)
    pop()
  }

  update() {
    let coords = Object.keys(this.restOfPath)[0].split(",")
    let pathLength = this.tiles.tile(coords[0], coords[1])[this.pos["side"]].length;
    if (this.pos["node"] + 1 == pathLength) {
      this.pos["node"] = 0;
      this.pos["side"] = "center"
    }
    if (this.pos["toCenter"]) {
      if (this.pos["node"] + 1 < pathLength) {
        this.pos["node"] += 1;
      }
    } else {
      if (this.pos["node"] - 1 > 0) {
        this.pos["node"] -= 1;
      }
    }
  }
}