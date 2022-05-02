class Enemy {
  constructor (tiles, restOfPath) {
    this.tiles = tiles;
    this.restOfPath = restOfPath;
    console.log(restOfPath)
  }

  show() {
    let pos = Object.keys(this.restOfPath)[0].split(",")
    push()
    translate(pos[0] * cellSize * tileSize, pos[1] * cellSize * tileSize)
    circle(0, 0, 20)
    pop()
  }
}