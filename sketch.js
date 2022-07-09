var mgr

function setup() {
  createCanvas(window.innerWidth, window.innerHeight).mouseWheel(scroll);
  COLORS.init()
  mgr = new SceneManager();
  mgr.wire()
  mgr.showScene(start);
}