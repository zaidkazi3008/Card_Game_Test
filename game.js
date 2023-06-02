const Deck = require('./deck');
const Player = require('./player');

class Game {
  constructor(numPlayers) {
    this.players = [];
    this.discardPile = [];
    this.drawPile = new Deck();

    for (let i = 1; i <= numPlayers; i++) {
      this.players.push(new Player(`Player ${i}`));
    }
  }

  initialize() {
    this.drawPile.initialize();
    this.drawPile.shuffle();

    for (let player of this.players) {
      for (let i = 0; i < 5; i++) {
        const card = this.drawPile.draw();
        player.addCard(card);
      }
    }

    const topCard = this.drawPile.draw();
    this.discardPile.push(topCard);
  }

  isGameEnded() {
    return this.players.some(player => player.hand.length === 0);
  }

  getNextPlayerIndex(currentPlayerIndex, reverse) {
    if (reverse) {
      return currentPlayerIndex === 0 ? this.players.length - 1 : currentPlayerIndex - 1;
    } else {
      return (currentPlayerIndex + 1) % this.players.length;
    }
  }

  handleTurn(playerIndex) {
    const currentPlayer = this.players[playerIndex];
    const topCard = this.discardPile[this.discardPile.length - 1];

    // Check if the player has any playable card
    if (currentPlayer.hand.some(card => currentPlayer.canPlayCard(card, topCard))) {
      // Play a card
      const playableCards = currentPlayer.hand.filter(card => currentPlayer.canPlayCard(card, topCard));
      const playedCard = playableCards[Math.floor(Math.random() * playableCards.length)];
      currentPlayer.removeCard(playedCard);
      this.discardPile.push(playedCard);

      // Apply action card effects
      switch (playedCard.rank) {
        case 'A': // Ace: Skip the next player
          playerIndex = this.getNextPlayerIndex(playerIndex, false);
          break;
        case 'K': // King: Reverse the sequence
          this.players.reverse();
          break;
        case 'Q': // Queen: +2 cards to the next player
          const nextPlayerIndex = this.getNextPlayerIndex(playerIndex, false);
          const nextPlayer = this.players[nextPlayerIndex];
          for (let i = 0; i < 2; i++) {
            const card = this.drawPile.draw();
            nextPlayer.addCard(card);
          }
          break;
        case 'J': // Jack: +4 cards to the next player
          const nextPlayerIndex2 = this.getNextPlayerIndex(playerIndex, false);
          const nextPlayer2 = this.players[nextPlayerIndex2];
          for (let i = 0; i < 4; i++) {
            const card = this.drawPile.draw();
            nextPlayer2.addCard(card);
          }
          break;
      }
    } else {
      // Draw a card since no playable card
      const card = this.drawPile.draw();
      currentPlayer.addCard(card);
    }

    // Switch to the next player
    playerIndex = this.getNextPlayerIndex(playerIndex, false);
    return playerIndex;
  }

  printGameState() {
    console.log('--- Current Game State ---');
    for (let player of this.players) {
      console.log(`${player.name}: ${player.hand.length} cards`);
    }
    console.log(`Top Card: ${this.discardPile[this.discardPile.length - 1].suit}-${this.discardPile[this.discardPile.length - 1].rank}`);
  }
  getWinner() {
    for (let player of this.players) {
      if (player.hand.length === 0) {
        return player;
      }
    }
    return null; // No winner yet
}
}


module.exports = Game;
