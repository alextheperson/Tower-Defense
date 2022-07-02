var CELL_WIDTH = 25*1.5;
var TILE_WIDTH = 8;
var TILE_SIZE = CELL_WIDTH * TILE_WIDTH;
var HALF_TILE_SIZE = TILE_SIZE / 2
var BIOME_SCALE = 1500
var VARIATION_SCALE = 10

class colors {
  init () {
    this.grass1 = color(80, 190, 100)
    this.grass2 = color(22, 113, 39)
    this.snow1 = color(220, 230, 235)
    this.snow2 = color(235, 226, 221)
    this.sand1 = color(194,178,128)
    this.sand2 = color(194,178,128)
    this.path1 = color(130, 70, 50)
    this.path2 = color(74, 37, 25)
    this.path3 = color(192, 136, 118)
    this.red1 = color(129, 1, 1)
    this.red2 = color(103, 43, 43)
    this.black1 = color(31, 3, 3)
    this.black2 = color(5, 3, 31)
    this.portal = color(200, 100, 255)
  }

  path(x, y) {
    let biome = noise(x / BIOME_SCALE, y / BIOME_SCALE)
    if (biome <= 0.6) {
      return lerpColor(this.path1, this.path3, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
    } else if (biome <= 0.4) {
      return lerpColor(this.path1, this.path2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
    } else {
      return this.path1
    }
  }
  
  grass(x, y) {
    let biome = noise(x / BIOME_SCALE, y / BIOME_SCALE)
    if (biome <= 0.5) {
      let grass = lerpColor(this.grass1, this.grass2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      let snow = lerpColor(this.snow1, this.snow2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      return lerpColor(snow, grass, biome * 2)
    } else {
      let grass = lerpColor(this.grass1, this.grass2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      let sand = lerpColor(this.sand1, this.sand2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      return lerpColor(grass, sand, (biome - 0.5) * 2)
    }
  }

  death(x, y) {
    let fac = noise(x / 100, y / 100)
    let red = lerpColor(this.red1, this.red2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
    let black = lerpColor(this.black1, this.black2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
    return lerpColor(red, black, fac)
  }

  start(x, y) {
    let biome = noise(x / 500, y / 500)
    if (biome <= 0.5) {
      let grass = lerpColor(this.grass1, this.grass2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      let snow = lerpColor(this.snow1, this.snow2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      return lerpColor(snow, grass, biome * 2)
    } else {
      let grass = lerpColor(this.grass1, this.grass2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      let sand = lerpColor(this.sand1, this.sand2, noise(x / VARIATION_SCALE, y / VARIATION_SCALE))
      return lerpColor(grass, sand, (biome - 0.5) * 2)
    }
  }

  grassMan(biome, variation) {
    if (biome <= 0.5) {
      let grass = lerpColor(this.grass1, this.grass2, variation)
      let snow = lerpColor(this.snow1, this.snow2, variation)
      return lerpColor(snow, grass, biome * 2)
    } else {
      let grass = lerpColor(this.grass1, this.grass2, variation)
      let sand = lerpColor(this.sand1, this.sand2, variation)
      return lerpColor(grass, sand, (biome - 0.5) * 2)
    }
  }

  stroke(color) {
    stroke(this[color])
  }

  fill(color) {
    fill(this[color])
  }
}

var COLORS = new colors()

function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

function randBool() {
  return Math.random() > 0.5
}

function randInt(min, max) {
  return Math.floor(random(min, max))
}

function drawShape(shapes) {
  for (let s = 0; s < shapes.length; s++) {
    push()
    let shape = shapes[s]
    if (shape["noFill"]) noFill()
    else fill(shape["fill"])
    if (shape["noStroke"]) noStroke()
    else {
      stroke(shape["stroke"])
      strokeWeight(shape["strokeWeight"])
      strokeJoin(shape["strokeJoin"])
    }
    beginShape()
    for (let m = 0; m < shape["moves"].length; m++) {
      let move = shape["moves"][m]
      vertex()
    }
    endShape()
    pop()
  }
}