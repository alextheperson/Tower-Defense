class TileManager {
  constructor () {
    let start = Math.round(Math.random() * 6 + 1)
    let start2 = Math.round(Math.random() * 3 + 1)
    let tempTile = {
      "location": [0,0],
      "center": [4, 5],
      "origin": true,
      "tower": true,
      "top": [
        [start, 0],
        [start, start2],
        [4, start2]
      ],
      "entrances": [],
      "path": {"0,0":"origin"}
    }
    this.tiles = [new Tile(this, [0, 0], tempTile)]
    this.coordTiles =  {"0,0": 0}
    this.entrances = [0]
    this.numTiles = [0.5, 0.5, 0.5, 0.5] // Up Down Left Right
    
    this.enemies = []
    this.towers = []
    this.projectiles = []
    
    this.takenTiles = {"x": [], "y": []}

    this.waveHardness = 1
    this.spawned = 0
    this.spawningWave = false
    this.enemiesToKill = 0
  }

  tile(x, y) {return (this.tiles[this.coordTiles[x+","+y]] == undefined) ? -1 : this.tiles[this.coordTiles[x+","+y]]}

  show(physics) {
    this.entrances = []
    for (let i = 0; i < this.tiles.length; i++) {
      let entrances = this.isEntrance(this.tiles[i].location);
      this.tiles[i].entrances = entrances;
      if (entrances.length > 0) this.entrances.push(i)
      this.tiles[i].show()
    }

    let relativeMousePos = [(mouseX - gridOffset[0]) * (1 / gridScale), (mouseY - gridOffset[1]) * (1 / gridScale)]
    let mouseTile = [Math.round(relativeMousePos[0] / TILE_SIZE) * TILE_SIZE, Math.round(relativeMousePos[1] / TILE_SIZE) * TILE_SIZE]
    let mouseCell = [Math.round((relativeMousePos[0] + CELL_WIDTH / 2) / CELL_WIDTH) * CELL_WIDTH - CELL_WIDTH / 2, Math.round((relativeMousePos[1] + CELL_WIDTH / 2) / CELL_WIDTH) * CELL_WIDTH - CELL_WIDTH / 2]
    let localCell = [((mouseCell[0] - mouseTile[0] + CELL_WIDTH / 2) + HALF_TILE_SIZE) / CELL_WIDTH - 1, ((mouseCell[1] - mouseTile[1] + CELL_WIDTH / 2) + HALF_TILE_SIZE) / CELL_WIDTH - 1]
    let hoveredTile = this.tile(Math.round(relativeMousePos[0] / TILE_SIZE), Math.round(relativeMousePos[1] / TILE_SIZE))
    
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].toClear) {
        this.enemies.splice(i, 1)
        this.spawnEnemies()
      } else {
        this.enemies[i].show(physics)
      }
    }
    
    for (let i = 0; i < this.projectiles.length; i++) {
      if (this.projectiles[i].toClear) {
        this.projectiles.splice(i, 1)
      } else {
        this.projectiles[i].show(physics)
      }
    }

    let isOnTower = false;
    
    for (let i = 0; i < this.towers.length; i++) {
      this.towers[i].show(physics)
      if (mouseCell[0] == this.towers[i].x && mouseCell[1] == this.towers[i].y) isOnTower = true;
    }

    if (hoveredTile != -1) {
      // console.log(towerToPlace, towerTypes[towerToPlace], towerTypes[towerToPlace].cost)
      let canPlaceTower = !(isOnTower || hoveredTile.onPath(localCell[0], localCell[1]) || coins < towerTypes[towerToPlace].cost)
      push()
      noFill()
      strokeJoin(MITER)
      if (canPlaceTower) stroke(255, 150)
      else stroke(255, 0, 0, 150)
      strokeWeight(5);
      // square(mouseTile[0], mouseTile[1], TILE_SIZE - 6);
      square(mouseCell[0], mouseCell[1], CELL_WIDTH - 6)
      this.towerPreview(mouseCell[0], mouseCell[1], towerToPlace, canPlaceTower)
      pop()
      if (canPlaceTower && mouseIsPressed && mouseButton === RIGHT) {
        coins -= towerTypes[towerToPlace].cost
        this.towers.push(new TOWER(mouseCell[0], mouseCell[1], this, towerTypes[towerToPlace]))
        towerTypes[towerToPlace].cost = Math.round(towerTypes[towerToPlace].cost * 1.05)
        this.takenTiles.x.push(mouseCell[0])
        this.takenTiles.y.push(mouseCell[1])
      }
    }
    if (frameCount % 20 == 0 && this.enemies.length <= 100) {
      this.spawnEnemies()
    }
  }

  dealAreaDamage(x, y, dmg, area) {
    for (let i = 0; i < this.enemies.length; i++) {
      if (dist(x, y, this.enemies[i].position[0], this.enemies[i].position[1]) <= this.enemies[i].size * CELL_WIDTH / 2 + area) {
        this.enemies[i].hurt(dmg)
      }
    }
  }

  towerPreview(x, y, tower, canPlaceTower) {
    push()
    if (canPlaceTower) fill(255, 150)
    else fill(255, 0, 0, 150)
    stroke(0)
    strokeWeight(1)
    translate(x, y)
    rotate(frameCount / 100)
    triangle(-CELL_WIDTH / towerTypes[tower]["width"], CELL_WIDTH / 2.4, CELL_WIDTH / towerTypes[tower]["width"], CELL_WIDTH / 2.4, 0, -CELL_WIDTH / 2.4)

    if (canPlaceTower) {
      // strokeWeight(2)
      // noFill()
      noStroke()
      fill(255, 25)
      circle(0, 0, towerTypes[tower]["range"] * 2)
    }
    pop()
  }
  
  isEntrance(pos, sides) {
    let tile = this.tile(pos.x, pos.y);
    let entrances = []
    if (tile != -1) {
      let neighbors = [this.tile(pos.x, pos.y - 1), this.tile(pos.x, pos.y + 1), this.tile(pos.x - 1, pos.y), this.tile(pos.x + 1, pos.y)]

      if (tile.portal) return ["portal"]
      if (tile.top != undefined && neighbors[0] == -1) entrances.push((sides) ? "top" : {"x": pos.x, "y": pos.y - 1})
      if (tile.bottom != undefined && neighbors[1] == -1) entrances.push((sides) ? "bottom" : {"x": pos.x, "y": pos.y + 1})
      if (tile.left != undefined && neighbors[2] == -1) entrances.push((sides) ? "left" : {"x": pos.x - 1, "y": pos.y})
      if (tile.right != undefined && neighbors[3] == -1) entrances.push((sides) ? "right" : {"x": pos.x + 1, "y": pos.y})
    }
    return entrances;
  }
  
  addTile(x, y) {
    let isNewTower = (nthWave + 1) % 5 == 0;
    let tile = new Tile(this, [x, y])
    if (isNewTower) {
      nthWave += 1;
      tile.tower = true;
    }
    this.tiles.push(tile)
    this.coordTiles[x+","+y] = this.tiles.length - 1
    if (y < 0) this.numTiles[0] = max(this.numTiles[0], Math.abs(y) + 0.5)
    if (y > 0) this.numTiles[1] = max(this.numTiles[1], Math.abs(y) + 0.5)
  
    if (x < 0) this.numTiles[2] = max(this.numTiles[2], Math.abs(x) + 0.5)
    if (x > 0) this.numTiles[3] = max(this.numTiles[3], Math.abs(x) + 0.5)

    if (!isNewTower) this.spawnWave()
  }

  spawnEnemies() {
    if (this.spawningWave) {
      let tile = this.tiles[this.entrances[Math.floor((Math.random()*this.entrances.length))]]
      let entranceNames = this.isEntrance(tile.location, true)
      let enemy = new Enemy(this, tile.path, entranceNames[Math.floor((Math.random()*entranceNames.length))])
      this.spawned += enemy.difficulty;
      this.enemies.push(enemy)

      if (this.spawned >= this.waveHardness) {
        this.spawningWave = false
        this.enemiesToKill = this.enemies.length
        nthWave += 1
      }
    }
  }

  spawnWave() {
    this.waveHardness = Math.round(2 ** (nthWave + Math.log2(5)))
    this.spawned = 0
    this.spawningWave = true
  }
}