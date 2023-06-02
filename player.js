const Card = require('./card');

class Player {
  constructor(name) {
    this.name = name;
    this.hand = [];
  }

  addCard(card) {
    this.hand.push(card);
  }

  removeCard(card) {
    const index = this.hand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
    if (index !== -1) {
      return this.hand.splice(index, 1)[0];
    }
    return null;
  }

  canPlayCard(card, topCard) {
    return topCard && (card.suit === topCard.suit || card.rank === topCard.rank);
  }
  
}

module.exports = Player;
