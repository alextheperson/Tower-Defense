class TileManager {
  constructor () {
    let start = Math.round(Math.random() * 6 + 1)
    let start2 = Math.round(Math.random() * 3 + 1)
    let tempTile = {
      "location": [0,0],
      "center": [4, 5.25],
      "tower": true,
      "top": [
        [start, 0],
        [start, start2],
        [4, start2]
      ],
      "entrances": [],
      "path": {"0,0":"tower"}
    }
    this.tiles = [new Tile(this, [0, 0], tempTile)]
    this.coordTiles =  {"0,0": 0}
    this.entrances = [0]
    this.numTiles = [0.5, 0.5, 0.5, 0.5] // Up Down Left Right
  }

  tile(x, y) {return (this.tiles[this.coordTiles[x+","+y]] == undefined) ? -1 : this.tiles[this.coordTiles[x+","+y]]}

  show () {
    this.entrances = []
    for (let i = 0; i < this.tiles.length; i++) {
      let entrances = this.isEntrance(this.tiles[i].location);
      this.tiles[i].entrances = entrances;
      if (entrances.length > 0) this.entrances.push(i)
      this.tiles[i].show()
    }
  }
  
  isEntrance(pos) {
    let tile = this.tile(pos.x, pos.y);
    let entrances = []
    if (tile != -1) {
      let neighbors = [this.tile(pos.x, pos.y - 1), this.tile(pos.x, pos.y + 1), this.tile(pos.x - 1, pos.y), this.tile(pos.x + 1, pos.y)]

      if (tile.portal) return "portal"
      if (tile.top != undefined && neighbors[0] == -1) entrances.push({"x": pos.x, "y": pos.y - 1})
      if (tile.bottom != undefined && neighbors[1] == -1) entrances.push({"x": pos.x, "y": pos.y + 1})
      if (tile.left != undefined && neighbors[2] == -1) entrances.push({"x": pos.x - 1, "y": pos.y})
      if (tile.right != undefined && neighbors[3] == -1) entrances.push({"x": pos.x + 1, "y": pos.y})
    }
    return entrances;
  }
  
  addTile(x, y) {
    let tile = new Tile(this, [x, y])
    this.tiles.push(tile)
    this.coordTiles[x+","+y] = this.tiles.length - 1
    if (y < 0) this.numTiles[0] = max(this.numTiles[0], Math.abs(y) + 0.5)
    if (y > 0) this.numTiles[1] = max(this.numTiles[1], Math.abs(y) + 0.5)
  
    if (x < 0) this.numTiles[2] = max(this.numTiles[2], Math.abs(x) + 0.5)
    if (x > 0) this.numTiles[3] = max(this.numTiles[3], Math.abs(x) + 0.5)
  }
}