var mgr

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  COLORS.init()
  mgr = new SceneManager();
  mgr.wire()
  mgr.showScene(start);
}