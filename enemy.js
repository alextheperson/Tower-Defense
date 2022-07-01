sides = {"0,-1": "bottom", "0,1": "top", "-1,0": "right", "1,0": "left"}
oppositeSides = {"top": "bottom", "bottom": "top", "left": "right", "right": "left"}

enemyTypes = [
  {
    "name": "tank",
    "health": 2,
    "speed": 0.5,
    "damage": 1.5,
    "size": 1.3,
    "color": [150, 150, 150],
    "difficulty": 7
  },
  {
    "name": "speedster",
    "health": 0.5,
    "speed": 3,
    "damage": 0.5,
    "size": 0.5,
    "color": [25, 200, 75],
    "difficulty": 10
  },
  {
    "name": "standard",
    "health": 1,
    "speed": 1,
    "damage": 1,
    "size": 1,
    "color": [200, 50, 75],
    "difficulty": 5
  }//,
  // {
  //   "name": "archer",
  //   "health": 0.7,
  //   "speed": 1.5,
  //   "damage": 0.75,
  //   "size": 0.7,
  //   "color": [50, 100, 200]
  // }
]

class Enemy {
  constructor (tiles, restOfPath, side) {
    this.tiles = tiles;
    this.path = [Object.keys(restOfPath)[0].split(",")]
    let pathLeft = restOfPath[Object.keys(restOfPath)[0]]
    while (true) {
      let nextTile = pathLeft[Math.floor((Math.random()*pathLeft.length))];
      this.path.push(Object.keys(nextTile)[0].split(","))
      pathLeft = Object.values(nextTile)[0]
      if (Object.values(nextTile)[0] === "origin") break
    }
    this.coordinatePath = []
    for (let i = 0; i < this.path.length; i++) {
      let currentTile = this.tiles.tile(this.path[i][0], this.path[i][1])
      let nextSide = (currentTile.origin) ? "origin" : sides[[Math.sign(this.path[i][0] - this.path[i + 1][0]), Math.sign(this.path[i][1] - this.path[i + 1][1])].join(",")]
      this.paths = [side, "center", nextSide]
      if (!currentTile.portal) {
        // console.log(side, currentTile, this.paths, this.path)
        for (let j = 0; j < currentTile[side].length; j++) {
          this.coordinatePath.push([currentTile[side][j][0] * CELL_WIDTH + currentTile.location.x * TILE_SIZE, currentTile[side][j][1] * CELL_WIDTH + currentTile.location.y * TILE_SIZE])
        }
      }
      this.coordinatePath.push([currentTile["center"][0] * CELL_WIDTH + currentTile.location.x * TILE_SIZE, currentTile["center"][1] * CELL_WIDTH + currentTile.location.y * TILE_SIZE])
      if (!currentTile.origin) {
        let secondPath = Array.from(currentTile[this.paths[2]]).reverse()
        for (let j = 0; j < secondPath.length; j++) {
          this.coordinatePath.push([secondPath[j][0] * CELL_WIDTH + currentTile.location.x * TILE_SIZE, secondPath[j][1] * CELL_WIDTH + currentTile.location.y * TILE_SIZE])
        }
      }
      side = oppositeSides[nextSide]
    }

    this.pathProgress = 0;
    this.position = [this.coordinatePath[0][0], this.coordinatePath[0][1]]
    this.pointLerpAmount = 0
    this.distanceToEnd = 0;
    this.isSimulating = true;
    this.toClear = false;
    this.age = 0;

    this.type = enemyTypes[Object.keys(enemyTypes)[Math.floor((Math.random()*Object.keys(enemyTypes).length))]]
    this.color = this.type.color
    this.size = this.type.size
    this.damage = this.type.damage
    this.speed = this.type.speed
    this.health = this.type.health * 50
    this.maxHealth = this.type.health * 50
    this.difficulty = this.type.difficulty
  }

  show(physics) {
    if (physics) this.update()

    if (this.isSimulating) {
      push()
      fill(this.color[0], this.color[1], this.color[2])
      noStroke()
      circle(this.position[0], this.position[1], CELL_WIDTH / 2 * this.size)
      rect(this.position[0], this.position[1] + 12.5, map(this.health, 0, this.maxHealth, 0, CELL_WIDTH), 5)
      pop()
    } else {
      if (this.age <= 10) {
        push()
        fill(this.color[0], this.color[1], this.color[2])
        noStroke()
        circle(this.position[0], this.position[1], (CELL_WIDTH / 2 * this.size) - ((-(CELL_WIDTH / 2 * this.size) / 100) * (this.age - 10) ** 2 + (CELL_WIDTH / 2 * this.size)))
        pop()
        this.age += 1;
      } else {
        this.toClear = true;
      }
    }
  }

  update() {
    if (this.isSimulating) {
      if (this.pointLerpAmount >= 1) {
        if (this.pathProgress < this.coordinatePath.length - 2) {
          this.pathProgress += 1
          this.pointLerpAmount = 0;
          this.position = [lerp(this.coordinatePath[this.pathProgress][0], this.coordinatePath[this.pathProgress + 1][0], this.pointLerpAmount) - HALF_TILE_SIZE, lerp(this.coordinatePath[this.pathProgress][1], this.coordinatePath[this.pathProgress + 1][1], this.pointLerpAmount) - HALF_TILE_SIZE]
        }
        else {
          this.isSimulating = false
          health -= this.damage
        }
      } else {
        if (dist(this.coordinatePath[this.pathProgress][0], this.coordinatePath[this.pathProgress][1], this.coordinatePath[this.pathProgress + 1][0], this.coordinatePath[this.pathProgress + 1][1]) == 0) {
          this.pathProgress += 1
          this.pointLerpAmount = 0;
        } else {
          this.pointLerpAmount += this.speed * 1 / dist(this.coordinatePath[this.pathProgress][0], this.coordinatePath[this.pathProgress][1], this.coordinatePath[this.pathProgress + 1][0], this.coordinatePath[this.pathProgress + 1][1])
        }
        this.position = [lerp(this.coordinatePath[this.pathProgress][0], this.coordinatePath[this.pathProgress + 1][0], this.pointLerpAmount) - HALF_TILE_SIZE, lerp(this.coordinatePath[this.pathProgress][1], this.coordinatePath[this.pathProgress + 1][1], this.pointLerpAmount) - HALF_TILE_SIZE]
      }
      this.distanceToEnd = dist(this.position[0], this.position[1], this.coordinatePath[this.pathProgress + 1][0] - HALF_TILE_SIZE, this.coordinatePath[this.pathProgress + 1][1] - HALF_TILE_SIZE)
      
      for (let i = this.pathProgress + 2; i < this.coordinatePath.length; i++) {
        this.distanceToEnd += dist(this.coordinatePath[i - 1][0] - HALF_TILE_SIZE, this.coordinatePath[i - 1][1] - HALF_TILE_SIZE, this.coordinatePath[i][0] - HALF_TILE_SIZE, this.coordinatePath[i][1] - HALF_TILE_SIZE)
      }
    }
  }

  hurt(amt) {
    this.health -= amt
    if ((this.health <= 0 || isNaN(this.health)) && this.isSimulating) {
      coins += this.difficulty
      // coins += 1
      this.isSimulating = false;
      // this.toClear = true;
    }
  }
}