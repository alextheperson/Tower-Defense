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
    if (this.tiles.tile(nextTile.x, nextTile.y) == -1) {
      let id = nextTile.x + "," + nextTile.y
      let x = 0;
      let y = 0;
      let numNeighbors = 0;
      for (let j = 0; j < neighbors.length; j++) {
        if (neighborPaths[j]) {
          x += (3 * nextTile.x + neighbors[j].location.x) / 4 * tileSize * cellSize - 15
          y += (3 * nextTile.y + neighbors[j].location.y) / 4 * tileSize * cellSize - 15
          numNeighbors += 1;
        }
      }
      this.addButton(x / numNeighbors, y / numNeighbors, id, () => {
        this.tiles.addTile(nextTile.x, nextTile.y);
        this.buttons.splice(this.getButtonById(id), 1);
      }, false)
    }
  }

  addButton(x, y, id, onclick, isHUD) {
    let ids = [];
    for (let i = 0; i < this.buttons.length; i++) {
      ids.push(this.buttons[i].id);
      if (this.buttons[i].id == id) {
        this.buttons[i].locate(x, y);
        this.buttons[i].onPress = onclick;
        this.buttons[i].isHUD = isHUD;
        break;
      }
    }
    if (ids.indexOf(id) == -1) {
      let newButton = new Clickable(x, y, id);
      newButton.isHUD = isHUD;
      newButton.onPress = onclick;
      this.buttons.push(newButton);
    }
  }
}