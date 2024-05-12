let sceneCanvas;
let sceneCanvasCTX;
let walls;
let player;
let gameOver = false;

function initializeScene() {
  sceneCanvas = setupCanvas(1920, 1080);
  sceneCanvasCTX = sceneCanvas.getContext("2d");

  walls = initializeWalls(5, 100, 200, 300, 800, 500, 700);
  player = initializePlayer(100, 500, 50, 0.5);

  setInterval(() => {
    mainLoop();
  }, 20);
}

function mainLoop() {
  if (!gameOver) {
    updateWalls(walls, 100, 200, 300, 800, 500);
    moveWalls(walls);

    movePlayer(player);
    updatePlayerVelocity(player);

    if (
      detectPlayerWallCollision(player, walls, sceneCanvas.height) ||
      detectPlayerFloorCollision(player)
    ) {
      gameOver = true;
    }
  }

  clearCanvas(sceneCanvas, sceneCanvasCTX);
  drawWalls(walls, sceneCanvasCTX, sceneCanvas.height);
  drawPlayer(player, sceneCanvasCTX, sceneCanvas.height);
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
  distanceBetweenWalls,
  closestWallX
) {
  let walls = [];
  for (let i = 0; i < numberOfWalls; i++) {
    walls.push(
      new Wall(
        wallWidth,
        i * distanceBetweenWalls + closestWallX,
        wallGapHeight,
        Math.random() * (maximumWallGapYPosition - minimumWallGapYPosition) +
          minimumWallGapYPosition
      )
    );
  }

  return walls;
}

function initializePlayer(xPosition, startingYPosition, length, gravity) {
  return new Player(xPosition, startingYPosition, length, gravity);
}

function drawPlayer(player, canvasCTX, canvasHeight) {
  player.draw(canvasCTX, canvasHeight);
}

function drawWalls(walls, canvasCTX, canvasHeight) {
  for (let wall of walls) {
    wall.draw(canvasCTX, canvasHeight);
  }
}

function updatePlayerVelocity(player) {
  player.velocity -= player.gravity;
}
function movePlayer(player) {
  player.yPosition += player.velocity;
}

function jumpPlayer(player) {
  player.velocity = 10;
}

function moveWalls(walls) {
  for (let wall of walls) {
    wall.xPosition -= 5;
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

function detectPlayerFloorCollision(player) {
  return player.yPosition <= 0;
}
function detectPlayerWallCollision(player, walls, canvasHeight) {
  for (let i = 0; i < walls.length; i++) {
    if (
      rectCollision(
        player.xPosition,
        player.yPosition,
        player.length,
        player.length,
        walls[i].xPosition,
        0,
        walls[i].width,
        walls[i].gapYPosition
      ) ||
      rectCollision(
        player.xPosition,
        player.yPosition,
        player.length,
        player.length,
        walls[i].xPosition,
        walls[i].gapYPosition + walls[i].gapHeight,
        walls[i].width,
        canvasHeight - (walls[i].gapYPosition + walls[i].gapHeight)
      )
    ) {
      return true;
    }
  }

  return false;
}

function rectCollision(x1, y1, width1, height1, x2, y2, width2, height2) {
  return (
    x1 < x2 + width2 &&
    x1 + width1 > x2 &&
    y1 < y2 + height2 &&
    y1 + height1 > y2
  );
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

  draw(canvasCTX, canvasHeight) {
    canvasCTX.fillStyle = "black";
    canvasCTX.fillRect(
      this.xPosition,
      canvasHeight - this.gapYPosition,
      this.width,
      this.gapYPosition
    );
    canvasCTX.fillRect(
      this.xPosition,
      0,
      this.width,
      canvasHeight - (this.gapYPosition + this.gapHeight)
    );
  }
}

class Player {
  constructor(xPosition, startingYPosition, length, gravity) {
    this.xPosition = xPosition;
    this.yPosition = startingYPosition;
    this.length = length;
    this.gravity = gravity;
    this.velocity = 0;
  }

  draw(canvasCTX, canvasHeight) {
    canvasCTX.fillStyle = "blue  ";
    canvasCTX.fillRect(
      this.xPosition,
      canvasHeight - (this.yPosition + this.length),
      this.length,
      this.length
    );
  }
}

class NeuralNetwork {
  constructor(numberOfInputs, hiddenLayersInputs, numberOfOutputs) {
    let inputNeurons = [];
    for (let i = 0; i < numberOfInputs; i++) {
      inputNeurons.push(new Neuron(1));
    }
    this.inputLayer = new Layer(inputNeurons);

    this.hiddenLayers = [];
    for (let i = 0; i < hiddenLayersInputs.length; i++) {
      let hiddenLayerNeurons = [];
      for (let j = 0; j < hiddenLayersInputs[i]; j++) {
        if (i == 0) {
          hiddenLayerNeurons.push(new Neuron(numberOfInputs));
        } else {
          hiddenLayerNeurons.push(new Neuron(hiddenLayersInputs[i - 1]));
        }
      }
      this.hiddenLayers.push(new Layer(hiddenLayerNeurons));
    }

    let outputNeurons = [];
    for (let i = 0; i < numberOfOutputs; i++) {
      outputNeurons.push(new Neuron(1));
    }
    this.outputLayer = new Layer(outputNeurons);
  }

  computeOutputs(inputs) {
    let inputLayerOutputs = this.inputLayer.computeOutputs(inputs);
    let hiddenLayerOutputs = inputLayerOutputs;
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      hiddenLayerOutputs =
        this.hiddenLayers[i].computeOutputs(hiddenLayerOutputs);
    }
    let outputLayerOutputs =
      this.outputLayer.computeOutputs(hiddenLayerOutputs);

    return outputLayerOutputs;
  }
}

class Layer {
  constructor(neurons) {
    this.neurons = neurons;
  }

  computeOutputs(inputs) {
    let outputs = [];
    for (let i = 0; i < this.neurons.length; i++) {
      for (let j = 0; j < this.neurons[i].weights.length; j++) {
        outputs.push(this.neurons[i].compute([inputs[j]]));
      }
    }
    return outputs;
  }
}

class Neuron {
  constructor(numberOfInputs) {
    this.weights = [];
    this.bias = Math.random() - 0.5;
    for (let i = 0; i < numberOfInputs; i++) {
      this.weights.push(Math.random() - 0.5);
    }
  }

  compute(inputs) {
    if (inputs.length != this.weights.length) {
      return "Error, weights and inputs must have the same length";
    }

    let output = 0;
    for (let i = 0; i < inputs.length; i++) {
      output += inputs[i] * this.weights[i];
    }

    output += this.bias;

    return sigmoid(output);
  }
}
let network = new NeuralNetwork(5, [], 1);
console.log(network.computeOutputs([0, 1, 1, 1, 1]));

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

document.addEventListener("keypress", function onEvent(event) {
  if (event.key === " ") {
    jumpPlayer(player);
  }
});
initializeScene();
