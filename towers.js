var towerTypes = {
  "arrow": {
    "maxTargets": 3,
    "range": 500,
    "fireRate": 25,
    "damage": 5,
    "damageArea": 0,
    "accuracy": 0.05,
    "cost": 50,
    "width": 16
  },
  "cannon": {
    "maxTargets": 1,
    "range": 250,
    "fireRate": 25,
    "damage": 10,
    "damageArea": 50,
    "accuracy": 0.2,
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
    this.damage = template["damage"]
    this.damageArea = template["damageArea"]
    this.accuracy = template["accuracy"]
    this.width = template["width"]
    
    this.targets = []
    this.cooldown = 100;

    this.tiles = tiles
  }

  show() {
    for (let i = 0; i < max(timeScale, 1); i++) {
      this.update()
    }
    
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
    if (keyCode == 192 && keyIsPressed === true) circle(0, 0, this.range * 2)
    pop()
  }

  update() {
    this.targets = []
    let enemies = this.tiles.enemies;
    
    for (let i = 0; i < min(enemies.length, this.maxTargets); i++) {
      for (let j = 0; j < enemies.length; j++) {
        if (!this.targets.includes(enemies[j]) && dist(this.x, this.y, enemies[j].position[0],  enemies[j].position[1]) < this.range) {
          if (this.targets[i] == undefined) {
            this.targets[i] = enemies[j]
          }
          else if (enemies[j].distanceToEnd < this.targets[i].distanceToEnd) {
            this.targets[i] = enemies[j]
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
      this.cooldown = max(this.cooldown - 60 / this.fireRate, 0)
    }
  }

  fire() {
    for (let i = 0; i < this.targets.length; i++) {
      let dir = Math.atan2(this.targets[i].position[1] - this.y, this.targets[i].position[0] - this.x)
      dir += map(Math.random(), 0, 0.9, -this.accuracy, this.accuracy)
      // console.log(dir)
      this.tiles.projectiles.push(new PROJECTILE(this.x, this.y, p5.Vector.fromAngle(dir, 10), this.damage, this.damageArea, this.range))
    }
  }
}

class PROJECTILE {
  constructor(x, y, vec, dmg, dmgArea, range) {
    this.originalPosition = [x, y]
    this.x = x;
    this.y = y;
    this.vec = vec;
    this.dmg = dmg;
    this.dmgArea = dmgArea;
    this.range = range;
  }

  show() {
    for (let i = 0; i < max(timeScale, 1); i++) {
      this.update()
    }
    
    circle(this.x, this.y, 10)
  }

  update() {
    this.x += this.vec.x
    this.y += this.vec.y
  }
}