const Game = require('./game');

const numPlayers = 2; // Number of players for the game

const game = new Game(numPlayers);
game.initialize();


let currentPlayerIndex = 0;
while (!game.isGameEnded()) {
  currentPlayerIndex = game.handleTurn(currentPlayerIndex);
  game.printGameState();
    
  const winner = game.getWinner();
if (winner) {
  console.log(`Player ${winner.name} wins the game!`);
  break;
}
}



console.log('Game Over!');
