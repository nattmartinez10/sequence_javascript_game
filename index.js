//Replace with all your real cards later
const cardList = ['clubs_2', 'clubs_3', 'clubs_4', 'clubs_5', 'clubs_6', 'clubs_7', 'clubs_8'];
let selectedCard = null;

//1. Generate board
const board = document.getElementById('board');

for (let i = 0; i < 100; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  const card = cardList[Math.floor(Math.random() * cardList.length)];
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

//2. Display player hand
const playerHand = document.getElementById('player-hand');

cardList.sort(() => 0.5 - Math.random()).slice(0, 5).forEach(card => {
  const img = document.createElement('img');
  img.src = `cards/${card}.png`;
  img.dataset.card = card;
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
