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
    this.path = color(130, 70, 50)
    this.portal = color(200, 100, 255)
  }

  get grass() {return this.grass1}
  get snow() {return this.snow1}
  get sand() {return this.sand1}
  
  fadeGrassLoc (x, y) {
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

  fadeGrass (biome) {
    if (biome <= 0.5) {
      // let grass = this["grass" + map(Math.random(), 0, 0.9, )]
      return lerpColor(this.snow, this.grass, biome * 2)
    } else {
      return lerpColor(this.grass, this.sand, (biome - 0.5) * 2)
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