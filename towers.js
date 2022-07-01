var towerTypes = {
  "Arrow Tower": {
    "maxTargets": 3,
    "range": 500,
    "fireRate": 5/3,
    "damage": 5,
    "damageArea": 0,
    "accuracy": 0.1,
    "fused": false,
    "projectile": {
      "shape": "line",
      "weight": 3,
      "length": 10,
      "speed": 15,
      "damage": 5,
      "area": 0,
      "range": 500,
    },
    "cost": 50,
    "width": 16
  },
  "Cannon Tower": {
    "maxTargets": 1,
    "range": 250,
    "fireRate": 10/3,
    "accuracy": 0.2,
    "fused": false,
    "projectile": {
      "shape": "circle",
      "size": 10,
      "speed": 5,
      "damage": 10,
      "area": 25,
      "range": 250,
    },
    "cost": 100,
    "width": 8
  },
  "Fused Cannon Tower": {
    "maxTargets": 1,
    "range": 250,
    "fireRate": 10/3,
    "accuracy": 0.2,
    "fused": true,
    "projectile": {
      "shape": "circle",
      "size": 10,
      "speed": 5,
      "damage": 10,
      "area": 25,
      "range": 250,
    },
    "cost": 200,
    "width": 8
  }
}

class TOWER {
  constructor(x, y, tiles, template) {
    this.x = x
    this.y = y
    this.maxTargets = template["maxTargets"]
    this.range = template["range"]
    this.fireRate = template["fireRate"]
    this.accuracy = template["accuracy"]
    this.width = template["width"]
    this.fused = template["fused"]
    this.projectile = template["projectile"]
    
    this.targets = []
    this.cooldown = 100;

    this.tiles = tiles
  }

  show(physics) {
    if (physics) this.update()
    
    push()
    translate(this.x, this.y)
    if (this.targets.length > 0) {
      for (let i = 0; i < this.targets.length; i++) {
        push()
        rotate(Math.atan2(this.targets[i].position[1] - this.y, this.targets[i].position[0] - this.x) + HALF_PI)
        triangle(-CELL_WIDTH / this.width, CELL_WIDTH / 2.4, CELL_WIDTH / this.width, CELL_WIDTH / 2.4, 0, -CELL_WIDTH / 2.4)
        pop()
        // line(0, 0, this.targets[i].position[0] - this.x, this.targets[i].position[1] - this.y)
      }
    } else {
        triangle(-CELL_WIDTH / this.width, CELL_WIDTH / 2.4, CELL_WIDTH / this.width, CELL_WIDTH / 2.4, 0, -CELL_WIDTH / 2.4)
    }
    rectMode(CORNER)
    rect(-CELL_WIDTH / 2.2, CELL_WIDTH / 2.2, 10, -map(this.cooldown, 0, 100, 0, CELL_WIDTH / 1.1))
    fill(255, 50)
    if (keyCode == 192 && keyIsPressed === true) {
      noStroke()
      fill(255, 50)
      circle(0, 0, this.range * 2)
    }
    pop()
  }

  update() {
    this.targets = []
    let enemies = this.tiles.enemies;
    
    for (let i = 0; i < min(enemies.length, this.maxTargets); i++) {
      for (let j = 0; j < enemies.length; j++) {
        if (dist(this.x, this.y, enemies[j].position[0],  enemies[j].position[1]) < this.range) {
          if (!this.targets.includes(enemies[j])){// || (this.targets.length < this.maxTargets && this.targets.length >= enemies.length)) {
          if (this.targets[i] == undefined) {
            this.targets[i] = enemies[j]
          }
          else if (enemies[j].distanceToEnd < this.targets[i].distanceToEnd) {
            this.targets[i] = enemies[j]
          }
          }
        }
      }
    }

    if (this.cooldown <= 0) {
      if (this.targets.length > 0) {
        this.cooldown = 100;
        this.fire()
      }
    } else {
      this.cooldown = max(this.cooldown - this.fireRate, 0)
    }
  }

  fire() {
    for (let i = 0; i < this.targets.length; i++) {
      let dir = Math.atan2(this.targets[i].position[1] - this.y, this.targets[i].position[0] - this.x)
      dir += map(Math.random(), 0, 0.9, -this.accuracy, this.accuracy)
      // console.log(dir)
      let fuse = -1
      if (this.fused) fuse = dist(this.x, this.y, this.targets[i].position[0], this.targets[i].position[1])
      this.tiles.projectiles.push(new PROJECTILE(this.x, this.y, p5.Vector.fromAngle(dir, 1), fuse, this.projectile, this.tiles))
    }
  }
}

class PROJECTILE {
  constructor(x, y, vec, fuse, stats, tiles) {
    this.originalPosition = [x, y]
    this.x = x;
    this.y = y;
    this.vec = vec;
    this.fuse = fuse;
    this.stats = stats;

    this.tiles = tiles
    this.isSimulating = true;
    this.toClear = false;
    this.age = 0;
  }

  show(physics) {
    if (physics) this.update()

    if (this.isSimulating) {
      push()
      translate(this.x, this.y)
      rotate(this.vec.heading())
      if (this.stats.shape == "circle") {
        circle(0, 0, this.stats.size)
      }
      else if (this.stats.shape == "line") {
        strokeWeight(this.stats.weight)
        line(-this.stats.length, 0, 0, 0)
      }
      pop()
    } else {
      if (this.age <= 10) {
        push()
        noStroke()
        fill(255, 100, 100, -8 * (this.age - 5)**2 + 200)
        circle(this.x, this.y, -((this.stats.area + 10) / 25) * (this.age - 5)**2 + this.stats.area + 10);
        pop()
        this.age += 1;
      } else {
        this.toClear = true;
      }
    }
  }

  update() {
    if (this.isSimulating) {
      this.x += this.vec.x * this.stats.speed
      this.y += this.vec.y * this.stats.speed

      for (let j = 0; j < this.tiles.enemies.length; j++) {
        if (dist(this.x, this.y, this.tiles.enemies[j].position[0], this.tiles.enemies[j].position[1]) <= this.tiles.enemies[j].size * CELL_WIDTH / 2) {
          this.tiles.enemies[j].hurt(this.stats.damage)
          this.tiles.dealAreaDamage(this.x, this.y, this.stats.damage, this.stats.area)
          this.isSimulating = false
        }
      }
      if (this.fuse > -1 && dist(this.x, this.y, this.originalPosition[0], this.originalPosition[1]) >= this.fuse){
        this.tiles.dealAreaDamage(this.x, this.y, this.stats.damage, this.stats.area)
        this.isSimulating = false
      } else if (dist(this.originalPosition[0], this.originalPosition[1], this.x, this.y) >= this.stats.range) {
        // this.tiles.dealAreaDamage(this.x, this.y, this.stats.damage, this.stats.area)
        // this.isSimulating = false
        this.toClear = true;
      }
    }
  }
}