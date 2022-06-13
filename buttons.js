class ButtonManager {
  constructor (tiles) {
    this.buttons = []
    this.tiles = tiles
  }
  
  getButtonById(id) {
    let ids = []
    for (let i = 0; i < this.buttons.length; i++) {
      ids.push(this.buttons[i].id);
      if (this.buttons[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  createButtons() {
    for (let i = 0; i < this.tiles.entrances.length; i++) {
      let tile = this.tiles.tiles[this.tiles.entrances[i]];
      for (let j = 0; j < tile.entrances.length; j++) {
        this.positionNewButton(tile.entrances[j])
      }
    }
  }
  
  show(isGrid) {
    this.createButtons()
    
    for (let i = 0; i < this.buttons.length; i++) {
      if (!isGrid == this.buttons[i].isHUD) {
        this.buttons[i].draw()
      }
    }
  }

  positionNewButton(nextTile) {
    let neighbors = [this.tiles.tile(nextTile.x, nextTile.y - 1), this.tiles.tile(nextTile.x, nextTile.y + 1), this.tiles.tile(nextTile.x - 1, nextTile.y), this.tiles.tile(nextTile.x + 1, nextTile.y)]
    let neighborPaths = [neighbors[0].bottom != undefined, neighbors[1].top != undefined, neighbors[2].right != undefined, neighbors[3].left != undefined]
    let nsdirection = 0
    let ewdirection = 0
    let tcd = ""
    if (this.tiles.tile(nextTile.x, nextTile.y) == -1) {
      let id = nextTile.x + "," + nextTile.y
      let x = 0;
      let y = 0;
      let numNeighbors = 0;
      for (let j = 0; j < neighbors.length; j++) {
        if (neighborPaths[j]) {
          if (nextTile.x < neighbors[j].location.x) ewdirection += 1
          if (nextTile.x > neighbors[j].location.x) ewdirection -= 1
          if (nextTile.y < neighbors[j].location.y) nsdirection -= 1
          if (nextTile.y > neighbors[j].location.y) nsdirection += 1
          x += (3 * nextTile.x + neighbors[j].location.x) / 4 * TILE_SIZE - 15
          y += (3 * nextTile.y + neighbors[j].location.y) / 4 * TILE_SIZE - 15
          numNeighbors += 1;
        }
      }
      tcd = ""
      if (nsdirection < 0) tcd += "n"
      if (nsdirection > 0) tcd += "s"
      if (ewdirection < 0) tcd += "e"
      if (ewdirection > 0) tcd += "w"
      // console.log(cursorDirection, `${cursorDirection}-resize`)
      this.addButton(x / numNeighbors, y / numNeighbors, id, () => {
        if (tiles.enemies.length == 0) {
          this.tiles.addTile(nextTile.x, nextTile.y);
          this.buttons.splice(this.getButtonById(id), 1);
        }
      }, false, () => {
        buttons.buttons[buttons.getButtonById(id)].color = "#bbbbbb";
        document.body.style.cursor = `${tcd}-resize`
        if (this.spawningWave || tiles.enemies.length > 0) document.body.style.cursor = "progress"
      })
    }
  }

  addButton(x, y, id, onclick, isHUD, onHover) {
    let ids = [];
    for (let i = 0; i < this.buttons.length; i++) {
      ids.push(this.buttons[i].id);
      if (this.buttons[i].id == id) {
        this.buttons[i].locate(x, y);
        this.buttons[i].onPress = onclick;
        this.buttons[i].isHUD = isHUD;
        this.buttons[i].onHover = onHover;
        break;
      }
    }
    if (ids.indexOf(id) == -1) {
      let newButton = new Clickable(x, y, id);
      newButton.isHUD = isHUD;
      newButton.onPress = onclick;
      newButton.onHover = onHover
      this.buttons.push(newButton);
    }
  }
}