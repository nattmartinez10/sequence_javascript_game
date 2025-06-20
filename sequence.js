const cardList = ['hearts_jack', 'diamonds_6', 'diamonds_7', 'diamonds_8', 'diamonds_9', 'diamonds_10', 'diamonds_queen','diamonds_king', 'diamonds_ace','spades_jack',
  'diamonds_5','hearts_3', 'hearts_2', 'spades_2', 'spades_3', 'spades_4', 'spades_5','spades_6', 'spades_7','clubs_ace',
  'diamonds_4', 'hearts_4', 'diamonds_king', 'diamonds_ace', 'clubs_ace', 'clubs_king', 'clubs_queen','clubs_10', 'spades_8','clubs_king',
  'diamonds_3', 'hearts_5', 'diamonds_queen', 'hearts_queen', 'hearts_10', 'hearts_9', 'hearts_8','clubs_9', 'spades_9','clubs_queen',
  'diamonds_2', 'hearts_6', 'diamonds_10', 'hearts_king', 'hearts_3', 'hearts_2', 'hearts_7','clubs_8', 'spades_10','clubs_10',
  'spades_ace','hearts_7', 'diamonds_9', 'hearts_ace', 'hearts_4', 'hearts_5', 'hearts_6','spades_6', 'spades_7','clubs_ace',
  'spades_king', 'hearts_8', 'diamonds_8', 'clubs_2', 'clubs_3', 'clubs_4', 'clubs_5','clubs_6', 'spades_king','clubs_8',
  'spades_queen', 'hearts_9', 'diamonds_7', 'diamonds_6', 'diamonds_5', 'diamonds_4', 'diamonds_3','diamonds_2', 'spades_ace','clubs_7',
  'spades_10', 'hearts_10', 'hearts_queen', 'hearts_king', 'hearts_ace', 'clubs_2', 'clubs_3','clubs_4', 'clubs_5','clubs_6',
  'clubs_jack','spades_9','spades_8','spades_7','spades_6','spades_5','spades_4','spades_3','spades_2','diamonds_jack','hearts_jack','diamonds_jack','spades_jack','clubs_jack'];

let selectedCard = null;
const board = document.getElementById('board');

// Create board
for (let i = 0; i < 100; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  const card = cardList[i];
  cell.dataset.card = card;

  const img = document.createElement('img');
  img.src = `cards/${card}.png`;
  img.classList.add('card');
  cell.appendChild(img);

  cell.addEventListener('click', () => {
    if (!selectedCard) return;
    if (cell.dataset.card === selectedCard) {
      if (!cell.querySelector('.chip')) {
        const chip = document.createElement('div');
        chip.classList.add('chip');
        cell.appendChild(chip);

        const cardImg = document.querySelector(`#player-hand img[data-card="${selectedCard}"]`);
        cardImg.remove();
        selectedCard = null;
      }
    }
  });

  board.appendChild(cell);
}

// Create hand
const playerHand = document.getElementById('player-hand');
const handCards = cardList.sort(() => 0.5 - Math.random()).slice(0, 7);

handCards.forEach((card, i) => {
  const img = document.createElement('img');
  img.src = `cards/${card}.png`;
  img.dataset.card = card;
  img.style.setProperty('--rotate', `${-15 + i * 5}deg`);
  img.addEventListener('click', () => {
    document.querySelectorAll('.hand img').forEach(el => el.classList.remove('selected'));
    if (selectedCard === card) {
      selectedCard = null;
    } else {
      selectedCard = card;
      img.classList.add('selected');
    }
  });
  playerHand.appendChild(img);
});
