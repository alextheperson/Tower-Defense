class UI {
  constructor (enemyTypes, buttons) {
    this.enemyTypes = enemyTypes
    this.buttons = buttons

    let smeButton = new Clickable(100, 20, "slower")
    smeButton.isHUD = true;
    smeButton.onPress = () => {timeScale = 0.5}
    smeButton.onHover = () => {smeButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}
    smeButton.text = "<<"
    smeButton.textSize = 10
    smeButton.width = 20
    smeButton.height = 20
    
    let smButton = new Clickable(120, 20, "slow")
    smButton.isHUD = true;
    smButton.onPress = () => {timeScale = 0.75}
    smButton.onHover = () => {smButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}
    smButton.text = "<"
    smButton.textSize = 10
    smButton.width = 20
    smButton.height = 20
    
    let rsButton = new Clickable(140, 20, "reset")
    rsButton.isHUD = true;
    rsButton.onPress = () => {timeScale = 1}
    rsButton.onHover = () => {rsButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}
    rsButton.text = "●"
    rsButton.textSize = 10
    rsButton.width = 20
    rsButton.height = 20

    let ffButton = new Clickable(160, 20, "fast")
    ffButton.isHUD = true;
    ffButton.onPress = () => {timeScale = 2}
    ffButton.onHover = () => {ffButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}
    ffButton.text = ">"
    ffButton.textSize = 10
    ffButton.width = 20
    ffButton.height = 20

    let ffeButton = new Clickable(180, 20, "faster")
    ffeButton.isHUD = true;
    ffeButton.onPress = () => {timeScale = 8}
    ffeButton.onHover = () => {ffeButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}
    ffeButton.text = ">>"
    ffeButton.textSize = 10
    ffeButton.width = 20
    ffeButton.height = 20

    let issuesButton = new Clickable(width - 100, height - 20, "faster")
    issuesButton.isHUD = true;
    issuesButton.onPress = () => {window.open("https://github.com/alextheperson/Tower-Defense/issues", '_blank');}
    issuesButton.onHover = () => {issuesButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}
    issuesButton.onTick = () => {issuesButton.locate(width - 100, height - 20)}
    issuesButton.text = "Report a bug (plz)"
    issuesButton.textSize = 10
    issuesButton.width = 100
    issuesButton.height = 20

    for (let i = 0; i < Object.keys(towerTypes).length; i++) {
      let tempButton = new Clickable(width - 150, 100 + 50 * i, Object.keys(towerTypes)[i])
      tempButton.isHUD = true;
      tempButton.onPress = () => {towerToPlace = Object.keys(towerTypes)[i]}
      tempButton.onHover = () => {tempButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}
      tempButton.onTick = () => {
        tempButton.text = `${Object.keys(towerTypes)[i]} ($${towerTypes[Object.keys(towerTypes)[i]]["cost"]})`
        tempButton.locate(width - 150, 100 + 50 * i)
        if (towerToPlace == Object.keys(towerTypes)[i]) tempButton.color = "#777777";
        if (coins < towerTypes[Object.keys(towerTypes)[i]]["cost"]) {
          tempButton.color = "#999999";
          tempButton.onHover = () => {tempButton.color = "#bbbbbb";document.body.style.cursor = "not-allowed"}
        } else {
          tempButton.onHover = () => {tempButton.color = "#bbbbbb";document.body.style.cursor = "pointer"}}
      }
      tempButton.textSize = 10
      tempButton.width = 150
      tempButton.height = 50

      buttons.buttons.push(tempButton)
    }

    buttons.buttons.push(smeButton, smButton, rsButton, ffButton, ffeButton, issuesButton)
  }

  show () {
    push()
    textAlign(LEFT, TOP)
    noStroke()
    for (let i = 0; i < this.enemyTypes.length; i++) {
      fill(this.enemyTypes[i].color[0], this.enemyTypes[i].color[1], this.enemyTypes[i].color[2])
      text(this.enemyTypes[i].name, 10, 10 + 20 * i)
    }
    pop()

    
    push()
    textAlign(CENTER, CENTER)
    textSize(15)
    text(timeScale * 100 + "% Speed", 150, 10)
    pop()
    
    push()
    textAlign(LEFT, CENTER)
    noStroke()
    fill(200, 150, 0)
    textSize(20)
    text(coins, width - 100, 20)
    stroke(200, 150, 0)
    strokeWeight(3)
    fill(255, 200, 50)
    circle(width - 120, 20, 20)
    fill(200, 150, 0)
    noStroke()
    rect(width - 120, 20, 3, 10)
    pop()
    
    push()
    textAlign(LEFT, CENTER)
    noStroke()
    fill(200, 50, 50)
    textSize(20)
    text(health, width - 100, 50)
    stroke(200, 50, 50)
    strokeWeight(3)
    fill(255, 100, 100)
    translate(width - 120, 50)
    rotate(QUARTER_PI)
    square(0, 0, 15)
    pop()

    push()
    let fps = min(max(Math.round(frameRate() / 5) * 5, 0), 60)
    translate(50, height)
    strokeWeight(2)
    
    fill(255, 0, 0)
    arc(0, 0, 50, 50, PI, 1.25 * PI)
    fill(255, 255, 0)
    arc(0, 0, 50, 50, 1.25 * PI, 1.75 * PI)
    fill(0, 255, 0)
    arc(0, 0, 50, 50, 1.75 * PI, 0)
    
    line(0, 0, sin(map(fps, 0, 60, 1, 0) * PI + HALF_PI) * 25, cos(map(fps, 0, 60, 1, 0) * PI + HALF_PI) * 25)

    fill(0)
    text("FPS: " + fps, 0, -35)
    pop()
    
    push()
    translate(150, 45)
    textAlign(CENTER, TOP)
    text(`Wave ${nthWave} (${tiles.waveHardness}) ${Math.round(min(tiles.spawned / tiles.waveHardness, 1) * 100)}%`, 0, 0)
    fill(255)
    circle(0, 40, 54)
    noStroke()
    fill(150)
    arc(0, 40, 54, 54, -HALF_PI, min(tiles.spawned / tiles.waveHardness, 1) * TWO_PI - HALF_PI)
    stroke(0)
    fill(255)
    circle(0, 40, 36)
    noStroke()
    fill(100)
    if (!tiles.spawningWave) arc(0, 40, 36, 36, -HALF_PI, map(tiles.enemies.length, 0, tiles.enemiesToKill, TWO_PI - HALF_PI, -HALF_PI), PIE)
    if (!this.spawningWave && tiles.enemies.length <= 0) fill(75, 200, 100)
    else fill(200, 175, 75)
    stroke(0)
    circle(0, 40, 18)
    pop()
  }
}