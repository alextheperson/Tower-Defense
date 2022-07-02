function start() {
  this.enter = () => {
    background(255);
  }
  
  this.draw = () => {
    resizeCanvas(window.innerWidth, window.innerHeight)
    background(255);

    push()
    for (let y = ((frameCount / 20) % CELL_WIDTH) - CELL_WIDTH; y < height + CELL_WIDTH; y += CELL_WIDTH) {
      for (let x = ((frameCount / 10) % CELL_WIDTH) - CELL_WIDTH; x < width + CELL_WIDTH; x += CELL_WIDTH) {
        fill(COLORS.start(x, y))
        square(x, y, CELL_WIDTH)
      }
    }
    pop()

    push()
    textAlign(CENTER, CENTER)
    rectMode(CENTER)
    noStroke()
    fill(255, 100)
    rect(width / 2, height / 2 - 10, 350, 100)
    fill(0)
    textSize(50)
    text("Tower Defense", width / 2, height / 2 - 20)
    textSize(10)
    text("Press Any Key To Play...", width / 2, height / 2 + 20)
    pop()
  }

  this.keyPressed = function() {
    // switch the scene
    this.sceneManager.showScene(game);
  }
}