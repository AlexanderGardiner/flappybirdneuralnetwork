let sceneCanvas;
let sceneCanvasCTX;
let walls;
function initializeScene() {
  sceneCanvas = setupCanvas(1920, 1080);
  sceneCanvasCTX = sceneCanvas.getContext("2d");

  walls = initializeWalls(5, 100, 200, 300, 800, 500);

  drawWalls(walls, sceneCanvasCTX, sceneCanvas.height);
  setInterval(() => {
    mainLoop();
  }, 20);
}

function mainLoop() {
  updateWalls(walls, 100, 200, 300, 800, 500);
  moveWalls(walls);
  clearCanvas(sceneCanvas, sceneCanvasCTX);
  drawWalls(walls, sceneCanvasCTX, sceneCanvas.height);
}

function clearCanvas(sceneCanvas, sceneCanvasCTX) {
  sceneCanvasCTX.clearRect(0, 0, sceneCanvas.width, sceneCanvas.height);
}

function initializeWalls(
  numberOfWalls,
  wallWidth,
  wallGapHeight,
  minimumWallGapYPosition,
  maximumWallGapYPosition,
  distanceBetweenWalls
) {
  let walls = [];
  for (let i = 0; i < numberOfWalls; i++) {
    walls.push(
      new Wall(
        wallWidth,
        i * distanceBetweenWalls,
        wallGapHeight,
        Math.random() * (maximumWallGapYPosition - minimumWallGapYPosition) +
          minimumWallGapYPosition
      )
    );
  }

  return walls;
}

function drawWalls(walls, canvasCTX, canvasHeight) {
  for (let wall of walls) {
    canvasCTX.fillRect(
      wall.xPosition,
      canvasHeight - (canvasHeight - wall.gapYPosition),
      wall.width,
      canvasHeight - wall.gapYPosition
    );
    canvasCTX.fillRect(
      wall.xPosition,
      0,
      wall.width,
      wall.gapYPosition - wall.gapHeight
    );
  }
}

function moveWalls(walls) {
  for (let wall of walls) {
    wall.xPosition -= 1;
  }
}

function updateWalls(
  walls,
  wallWidth,
  wallGapHeight,
  minimumWallGapYPosition,
  maximumWallGapYPosition,
  distanceBetweenWalls
) {
  for (let i = 0; i < walls.length; i++) {
    if (walls[i].xPosition < 0 - wallWidth) {
      walls.shift();
      walls.push(
        new Wall(
          wallWidth,
          walls[walls.length - 1].xPosition + distanceBetweenWalls,
          wallGapHeight,
          Math.random() * (maximumWallGapYPosition - minimumWallGapYPosition) +
            minimumWallGapYPosition
        )
      );
    }
  }
}

function setupCanvas(canvasWidth, canvasHeight) {
  let sceneCanvas = document.getElementById("sceneCanvas");

  sceneCanvas.width = canvasWidth;
  sceneCanvas.height = canvasHeight;

  return sceneCanvas;
}

class Wall {
  constructor(width, xPosition, gapHeight, gapYPosition) {
    this.width = width;
    this.xPosition = xPosition;

    this.gapHeight = gapHeight;
    this.gapYPosition = gapYPosition;
  }
}

initializeScene();
