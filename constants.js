var CELL_WIDTH = 25*1.5;
var TILE_WIDTH = 8;
var TILE_SIZE = CELL_WIDTH * TILE_WIDTH;
var HALF_TILE_SIZE = TILE_SIZE / 2

class colors {
  init () {
    this.grass = color(80, 190, 100)
    this.snow = color(220, 230, 235)
    this.sand = color(194,178,128)
    this.path = color(130, 70, 50)
    this.portal = color(200, 100, 255)
  }

  fadeGrass (biome) {
    if (biome <= 0.5) {
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