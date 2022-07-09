var slotOne, slotTwo, slotThree, slotFour, slotFive

function start() {
  this.enter = () => {
    background(255);
    slotOne = new Clickable(width / 2 - 150, height / 2 + 50, 95, 40, "saveslot1", "Slot One")
    slotTwo = new Clickable(width / 2 - 45, height / 2 + 50, 90, 40, "saveslot1", "Slot Dos")
    slotThree = new Clickable(width / 2 + 55, height / 2 + 50, 95, 40, "saveslot1", "Slot 三")
    slotFour = new Clickable(width / 2 - 150, height / 2 + 100, 145, 40, "saveslot1", "Slot Quatre")
    slotFive = new Clickable(width / 2 + 5, height / 2 + 100, 145, 40, "saveslot1", "Slot Öt")

    slotOne.color = color(255, 150)
    slotOne.onOutside = () => {slotOne.color = color(255, 150)}
    slotOne.onHover = () => {slotOne.color = color(255, 200)}
    slotOne.onPress = () => {slotOne.color = color(255)}

    slotTwo.color = color(255, 150)
    slotTwo.onOutside = () => {slotTwo.color = color(255, 150)}
    slotTwo.onHover = () => {slotTwo.color = color(255, 200)}
    slotTwo.onPress = () => {slotTwo.color = color(255)}

    slotThree.color = color(255, 150)
    slotThree.onOutside = () => {slotThree.color = color(255, 150)}
    slotThree.onHover = () => {slotThree.color = color(255, 200)}
    slotThree.onPress = () => {slotThree.color = color(255)}

    slotFour.color = color(255, 150)
    slotFour.onOutside = () => {slotFour.color = color(255, 150)}
    slotFour.onHover = () => {slotFour.color = color(255, 200)}
    slotFour.onPress = () => {slotFour.color = color(255)}

    slotFive.color = color(255, 150)
    slotFive.onOutside = () => {slotFive.color = color(255, 150)}
    slotFive.onHover = () => {slotFive.color = color(255, 200)}
    slotFive.onPress = () => {slotFive.color = color(255)}
  }
  
  this.draw = () => {
    resizeCanvas(window.innerWidth, window.innerHeight)
    background(255);

    push()
    strokeWeight(2)
    for (let y = Math.floor((mouseY / 10 + frameCount / 5) % CELL_WIDTH) - CELL_WIDTH; y < height + CELL_WIDTH; y += CELL_WIDTH) {
      for (let x = Math.floor((mouseX / 10 + frameCount / 2) % CELL_WIDTH) - CELL_WIDTH; x < width + CELL_WIDTH; x += CELL_WIDTH) {
        fill(COLORS.start(x, y))
        square(x, y, CELL_WIDTH)
      }
    }
    pop()

    push()
    textAlign(CENTER, CENTER)
    rectMode(CENTER)
    strokeWeight(2)
    fill(255, 150)
    rect(width / 2, height / 2 - 10, 300, 100)
    fill(0)
    textSize(50)
    text("Tile Defense", width / 2, height / 2 - 20)
    textSize(10)
    text("Select a Save Slot", width / 2, height / 2 + 20)

    slotOne.draw()
    slotTwo.draw()
    slotThree.draw()
    slotFour.draw()
    slotFive.draw()
    pop()
  }

  this.keyPressed = function() {
    // switch the scene
    this.sceneManager.showScene(game);
  }
}