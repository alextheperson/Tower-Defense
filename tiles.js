class TileManager {
  constructor () {
    let start = Math.round(Math.random() * 6 + 1)
    let start2 = Math.round(Math.random() * 3 + 1)
    let tempTile = {
      "location": [0,0],
      "center": [4, 5],
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

  show() {
    this.entrances = []
    for (let i = 0; i < this.tiles.length; i++) {
      let entrances = this.isEntrance(this.tiles[i].location);
      this.tiles[i].entrances = entrances;
      if (entrances.length > 0) this.entrances.push(i)
      this.tiles[i].show()
    }
    
    let mouseTile = [Math.round((mouseX - gridOffset[0]) / TILE_SIZE) * TILE_SIZE, Math.round((mouseY - gridOffset[1]) / TILE_SIZE) * TILE_SIZE]
    let mouseCell = [Math.round((mouseX - gridOffset[0] + CELL_WIDTH / 2) / CELL_WIDTH) * CELL_WIDTH - CELL_WIDTH / 2, Math.round((mouseY - gridOffset[1] + CELL_WIDTH / 2) / CELL_WIDTH) * CELL_WIDTH - CELL_WIDTH / 2]
    let localCell = [((mouseCell[0] - mouseTile[0] + CELL_WIDTH / 2) + HALF_TILE_SIZE) / CELL_WIDTH - 1, ((mouseCell[1] - mouseTile[1] + CELL_WIDTH / 2) + HALF_TILE_SIZE) / CELL_WIDTH - 1]
    let hoveredTile = this.tile(Math.round((mouseX - gridOffset[0]) / TILE_SIZE), Math.round((mouseY - gridOffset[1]) / TILE_SIZE))
    
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].health <= 0 || isNaN(this.enemies[i].health)) {
        coins += this.enemies[i].difficulty
        this.enemies.splice(i, 1)
        this.spawnEnemies()
      } else {
        this.enemies[i].show()
      }
    }
    
    for (let i = 0; i < this.projectiles.length; i++) {
      if (dist(this.projectiles[i].originalPosition[0], this.projectiles[i].originalPosition[1], this.projectiles[i].x, this.projectiles[i].y) >= this.projectiles[i].range) {
        this.projectiles.splice(i, 1)
      } else {
        this.projectiles[i].show();
        for (let j = 0; j < this.enemies.length; j++) {
          if (dist(this.projectiles[i].x, this.projectiles[i].y, this.enemies[j].position[0], this.enemies[j].position[1]) <= this.enemies[j].size * CELL_WIDTH / 2) {
            this.enemies[j].hurt(this.projectiles[i].dmg)
            this.dealAreaDamage(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].dmg, this.projectiles[i].dmgArea)
            this.projectiles.splice(i, 1)
            break
          }
        }
      }
    }

    let isOnTower = false;
    
    for (let i = 0; i < this.towers.length; i++) {
      this.towers[i].show()
      if (mouseCell[0] == this.towers[i].x && mouseCell[1] == this.towers[i].y) isOnTower = true;
    }

    if (hoveredTile != -1) {
      // console.log(towerToPlace, towerTypes[towerToPlace], towerTypes[towerToPlace].cost)
      let canPlaceTower = !(isOnTower || hoveredTile.onPath(localCell[0], localCell[1]) || coins < towerTypes[towerToPlace].cost)
      push()
      noFill()
      strokeJoin(MITER)
      if (!canPlaceTower) stroke(255, 0, 0, 150)
      else stroke(255, 150)
      strokeWeight(5);
      // square(mouseTile[0], mouseTile[1], TILE_SIZE - 6);
      square(mouseCell[0], mouseCell[1], CELL_WIDTH - 6)
      pop()
      if (canPlaceTower && mouseIsPressed && mouseButton === RIGHT) {
        coins -= towerTypes[towerToPlace].cost
        this.towers.push(new TOWER(mouseCell[0], mouseCell[1], this, towerTypes[towerToPlace]))
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
    let tile = new Tile(this, [x, y])
    this.tiles.push(tile)
    this.coordTiles[x+","+y] = this.tiles.length - 1
    if (y < 0) this.numTiles[0] = max(this.numTiles[0], Math.abs(y) + 0.5)
    if (y > 0) this.numTiles[1] = max(this.numTiles[1], Math.abs(y) + 0.5)
  
    if (x < 0) this.numTiles[2] = max(this.numTiles[2], Math.abs(x) + 0.5)
    if (x > 0) this.numTiles[3] = max(this.numTiles[3], Math.abs(x) + 0.5)

    this.spawnWave()
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
    this.waveHardness = 2 ** nthWave
    this.spawned = 0
    this.spawningWave = true
  }
}