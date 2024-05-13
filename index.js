let sceneCanvas;
let sceneCanvasCTX;
let walls;
let players = [];
let gameOver = [];
let networks = [];
let networksFailureTimes = [];
let totalAgents = 1;
let geneticDivergenceFactor = 1;

let mainLoopInterval;

function initializeScene() {
  sceneCanvas = setupCanvas(1920, 1080);
  sceneCanvasCTX = sceneCanvas.getContext("2d");

  walls = initializeWalls(5, 100, 200, 300, 800, 500, 700);

  for (let i = 0; i < totalAgents; i++) {
    players.push(initializePlayer(100, 500, 50, 0.5));
    networks.push(new NeuralNetwork(4, [4], [3], 1));
  }

  mainLoopInterval = setInterval(() => {
    mainLoop();
  }, 20);
}

function newGeneration(winningNetwork) {
  console.log(winningNetwork);
  players = [];
  networks = [];
  walls = [];
  networksFailureTimes = [];
  gameOver = [];
  walls = initializeWalls(5, 100, 200, 300, 800, 500, 700);
  for (let i = 0; i < totalAgents; i++) {
    players.push(initializePlayer(100, 500, 50, 0.5));
    networks.push(
      new NeuralNetwork(
        4,
        [4],
        [3],
        1,
        winningNetwork.inputLayer,
        winningNetwork.hiddenLayers,
        winningNetwork.outputLayer
      )
    );
    console.log(networks[i]);
    networks[i].geneticEvolution(geneticDivergenceFactor);
    console.log(networks[i]);
  }

  // mainLoopInterval = setInterval(() => {
  //   mainLoop();
  // }, 20);
}

function getAgentAction(network, player, walls) {
  let closestWall = walls[walls.length - 1];
  for (let wall of walls) {
    if (
      !(wall.xPosition + wall.width < player.xPosition) &&
      wall.xPosition < closestWall.xPosition
    ) {
      closestWall = wall;
    }
  }
  // console.log(network);
  let computation = network.computeOutputs([
    [horizontalDistanceFromPlayerToWall(player, closestWall)],
    [playerDistanceFromGround(player)],
    [verticalDistanceFromPlayerToHole(player, closestWall)],
    [player.velocity],
  ]);

  return computation > 0.5;
}

function getMostRecentIndices(array, count) {
  // Create an array to store the indices of the most recent dates
  let recentIndices = [];

  // Create a copy of the array to avoid modifying the original array
  let copyArray = array.slice();

  // Sort the copied array in descending order (most recent dates first)
  copyArray.sort((a, b) => b - a);

  // Loop through the sorted array and store the indices of the most recent dates
  for (let i = 0; i < count; i++) {
    let index = array.indexOf(copyArray[i]);
    if (index !== -1) {
      recentIndices.push(index);
    }
  }

  return recentIndices;
}

function mainLoop() {
  clearCanvas(sceneCanvas, sceneCanvasCTX);

  updateWalls(walls, 100, 200, 300, 800, 500);
  moveWalls(walls);

  let livingPlayersCount = 0;
  for (let i = 0; i < players.length; i++) {
    if (!gameOver[i]) {
      if (getAgentAction(networks[i], players[i], walls)) {
        jumpPlayer(players[i], 15);
      }
      movePlayer(players[i]);
      updatePlayerVelocity(players[i]);
      if (players[i].yPosition + players[i].length > sceneCanvas.height) {
        players[i].yPosition = sceneCanvas.height - players[i].length - 2;
      }

      if (
        detectPlayerWallCollision(players[i], walls, sceneCanvas.height) ||
        detectPlayerFloorCollision(players[i])
      ) {
        gameOver[i] = true;
        networksFailureTimes[i] = new Date();
      }
      drawPlayer(players[i], sceneCanvasCTX, sceneCanvas.height, "blue", 1);
      livingPlayersCount += 1;
    } else {
      drawPlayer(players[i], sceneCanvasCTX, sceneCanvas.height, "red", 0.2);
    }
  }

  drawWalls(walls, sceneCanvasCTX, sceneCanvas.height);

  if (livingPlayersCount == 0) {
    clearInterval(mainLoopInterval);
    console.log(getMostRecentIndices(networksFailureTimes, 1));
    newGeneration(networks[getMostRecentIndices(networksFailureTimes, 1)]);
  }
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

function drawPlayer(player, canvasCTX, canvasHeight, color, alpha) {
  player.draw(canvasCTX, canvasHeight, color, alpha);
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

function jumpPlayer(player, velocity) {
  player.velocity = velocity;
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

function horizontalDistanceFromPlayerToWall(player, wall) {
  return wall.xPosition - (player.xPosition + player.length);
}

function playerDistanceFromGround(player) {
  return player.yPosition;
}

function verticalDistanceFromPlayerToHole(player, wall) {
  return wall.gapYPosition - player.yPosition;
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

  draw(canvasCTX, canvasHeight, color, alpha) {
    canvasCTX.fillStyle = color;
    canvasCTX.globalAlpha = alpha;
    canvasCTX.fillRect(
      this.xPosition,
      canvasHeight - (this.yPosition + this.length),
      this.length,
      this.length
    );
    canvasCTX.globalAlpha = 1;
  }
}

class NeuralNetwork {
  constructor(
    numberOfInputs,
    hiddenLayersInputs,
    hiddenLayersHeights,
    numberOfOutputs,
    inputLayer,
    hiddenLayers,
    outputLayer
  ) {
    if (inputLayer == null) {
      let inputNeurons = [];
      for (let i = 0; i < numberOfInputs; i++) {
        inputNeurons.push(new Neuron(1));
      }
      this.inputLayer = new Layer(inputNeurons);
    } else {
      let inputNeurons = [];
      for (let i = 0; i < numberOfInputs; i++) {
        inputNeurons.push(
          new Neuron(
            1,
            inputLayer.neurons[i].weights,
            inputLayer.neurons[i].bias
          )
        );
      }
      this.inputLayer = new Layer(inputNeurons);
    }

    if (hiddenLayers == null) {
      this.hiddenLayers = [];
      if (hiddenLayersInputs.length != hiddenLayersHeights.length) {
        return "There must be an equal number of hidden layers passed for inputs and heights";
      }
      for (let i = 0; i < hiddenLayersInputs.length; i++) {
        let hiddenLayerNeurons = [];
        for (let j = 0; j < hiddenLayersHeights[i]; j++) {
          hiddenLayerNeurons.push(new Neuron(hiddenLayersInputs[i]));
        }
        this.hiddenLayers.push(new Layer(hiddenLayerNeurons));
      }
    } else {
      this.hiddenLayers = [];
      if (hiddenLayersInputs.length != hiddenLayersHeights.length) {
        return "There must be an equal number of hidden layers passed for inputs and heights";
      }
      for (let i = 0; i < hiddenLayersInputs.length; i++) {
        let hiddenLayerNeurons = [];
        for (let j = 0; j < hiddenLayersHeights[i]; j++) {
          hiddenLayerNeurons.push(
            new Neuron(
              hiddenLayersInputs[i],
              hiddenLayers[i].neurons[j].weights,
              hiddenLayers[i].neurons[j].bias
            )
          );
        }
        this.hiddenLayers.push(new Layer(hiddenLayerNeurons));
      }
    }

    if (outputLayer == null) {
      let outputNeurons = [];
      for (let i = 0; i < numberOfOutputs; i++) {
        outputNeurons.push(
          new Neuron(
            this.hiddenLayers[this.hiddenLayers.length - 1].neurons.length
          )
        );
      }
      this.outputLayer = new Layer(outputNeurons);
    } else {
      let outputNeurons = [];
      for (let i = 0; i < numberOfOutputs; i++) {
        outputNeurons.push(
          new Neuron(
            this.hiddenLayers[this.hiddenLayers.length - 1].neurons.length,
            outputLayer.weights,
            outputLayer.bias
          )
        );
      }
      this.outputLayer = new Layer(outputNeurons);
    }
  }

  geneticEvolution(geneticDivergenceFactor) {
    this.inputLayer.geneticEvolution(geneticDivergenceFactor);
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      this.hiddenLayers[i].geneticEvolution(geneticDivergenceFactor);
    }
    this.outputLayer.geneticEvolution(geneticDivergenceFactor);
  }

  computeOutputs(inputs) {
    // console.log(inputs);
    let inputLayerOutputs = this.inputLayer.computeOutputs(inputs);
    // console.log("input layer", inputLayerOutputs);
    let hiddenLayerOutputs = [];

    for (let i = 0; i < this.hiddenLayers[0].neurons.length; i++) {
      hiddenLayerOutputs.push(inputLayerOutputs);
    }
    // console.log("hidden layer inputs", hiddenLayerOutputs);
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      hiddenLayerOutputs =
        this.hiddenLayers[i].computeOutputs(hiddenLayerOutputs);
      // console.log("hidden layer outputs", hiddenLayerOutputs);

      // console.log("test");
      // console.log("hidden layer ", i, hiddenLayerOutputs);
    }

    let outputLayerOutputs = this.outputLayer.computeOutputs([
      hiddenLayerOutputs,
    ]);

    return outputLayerOutputs;
  }
}

class Layer {
  constructor(neurons) {
    this.neurons = neurons;
  }

  geneticEvolution(geneticDivergenceFactor) {
    for (let i = 0; i < this.neurons.length; i++) {
      console.log("test");
      console.log(this.neurons[i]);
      this.neurons[i].geneticEvolution(geneticDivergenceFactor);
      console.log(this.neurons[i]);
    }
  }

  computeOutputs(inputs) {
    let outputs = [];
    for (let i = 0; i < this.neurons.length; i++) {
      outputs.push(this.neurons[i].compute(inputs[i]));
    }
    return outputs;
  }
}

class Neuron {
  constructor(numberOfInputs, weights, bias) {
    if (weights == null) {
      this.weights = [];
      for (let i = 0; i < numberOfInputs; i++) {
        this.weights.push(Math.random() - 0.5);
      }
    } else {
      this.weights = weights;
    }

    if (this.bias == null) {
      this.bias = Math.random() - 0.5;
    } else {
      this.bias = bias;
    }
  }

  geneticEvolution(geneticDivergenceFactor) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += (Math.random() - 0.5) * geneticDivergenceFactor;
    }

    this.bias += (Math.random() - 0.5) * geneticDivergenceFactor;
  }

  compute(inputs) {
    // console.log(inputs.length);
    // console.log(this.weights.length);
    if (inputs.length != this.weights.length) {
      console.log("Error, weights and inputs must have the same length");
      return "Error, weights and inputs must have the same length";
    }

    let output = 0;
    for (let i = 0; i < inputs.length; i++) {
      output += inputs[i] * this.weights[i];
    }

    //output += this.bias;

    return sigmoid(output);
  }
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

document.addEventListener("keypress", function onEvent(event) {
  if (event.key === " ") {
    for (let player of players) {
      jumpPlayer(player, Math.random() * 10);
    }
  }
});
initializeScene();
