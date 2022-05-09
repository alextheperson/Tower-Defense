var COLORS = {
  "grass": [80, 190, 100],
  "path": [130, 70, 50],
  "portal": [200, 100, 255]
}

function hexagon (x, y, a) {
  let r = (a / 2) / (cos(1/6*PI))
  beginShape()
  for (let i = 0; i <= 6; i++) {
    vertex(x + r * sin(i / 3 * PI), y + r * cos(i / 3 * PI))
  }
  endShape()
}