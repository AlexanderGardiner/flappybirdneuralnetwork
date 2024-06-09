# flappybirdneuralnetwork README

## Overview

This project is a super basic Flappy Bird clone implemented in the browser, featuring a simple genetic neural network to train the birds to play the game autonomously. The game is built using HTML5, CSS3, and JavaScript, with the genetic neural network written from scratch. The goal is to train virtual birds to play the game autonomously using a genetic algorithm and a neural network.

## Built With

<img src="https://img.shields.io/badge/-HTML5-E34F26?style=flat&logo=html5&logoColor=white" height="25"><!---->
<img src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" height="25"><!---->
<img src="https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3&logoColor=white" height="25"><!---->
<img src="https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white" height="25"><!---->
<img src="https://img.shields.io/badge/-Express.js-000000?style=flat&logo=express&logoColor=white" height="25"><!---->

## Features

- Classic Flappy Bird gameplay

- Autonomous birds powered by a genetic neural network

- Custom genetic neural network written from scratch

## How It Works

### Game Mechanics

The game follows the classic Flappy Bird mechanics:

- The bird must navigate through gaps between pipes without hitting them.
- The player (or AI) controls the bird by making it flap, causing it to rise; otherwise, it falls due to gravity.

### Genetic Algorithm

The genetic algorithm evolves the population of birds over generations to improve their performance:

- **Selection**: The bird that survives the longest is set to seed the next generation.
- **Mutation**: Random changes are introduced to the offspring's neural networks to maintain genetic diversity.

### Neural Network

Each bird is equipped with a simple neural network that decides when to flap:

- **Inputs**: The neural network takes inputs such as the bird's position and the distance to the next pipe.
- **Outputs**: The neural network outputs a decision on whether the bird should flap or not.
- The neural network is trained through the genetic algorithm to improve its decision-making over generations.

## Installation

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/alexandergardiner/flappybirdneuralnetwork.git
   ```
2. **Navigate to the Project Directory**:
   ```sh
   cd flappybirdneuralnetwork
   ```
3. **Install Dependencies**:
   ```sh
   npm install
   ```
4. **Run the Game**:
   ```sh
   npm start
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
