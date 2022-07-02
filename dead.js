function died() {
  this.enter = () => {
    background(255);
  }
  
  this.draw = () => {
    resizeCanvas(window.innerWidth, window.innerHeight)
    background(255);

    push()
    strokeWeight(2)
    for (let y = Math.floor((mouseY / 10 + frameCount / 2) % CELL_WIDTH) - CELL_WIDTH; y < height + CELL_WIDTH; y += CELL_WIDTH) {
      for (let x = Math.floor((mouseX / 10 + frameCount / 5) % CELL_WIDTH) - CELL_WIDTH; x < width + CELL_WIDTH; x += CELL_WIDTH) {
        fill(COLORS.death(x, y))
        square(x, y, CELL_WIDTH)
      }
    }
    pop()

    push()
    textAlign(CENTER, CENTER)
    rectMode(CENTER)
    noStroke()
    fill(255, 100)
    rect(width / 2, height / 2 - 10, 250, 100)
    fill(0)
    textSize(50)
    text("You Died", width / 2, height / 2 - 20)
    textSize(10)
    text("Press Any Key To Play Again...", width / 2, height / 2 + 20)
    pop()
  }

  this.keyPressed = function() {
    // switch the scene
    this.sceneManager.showScene(start);
  }
}