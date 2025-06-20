const cardList = [
  'hearts_jack', 'diamonds_6', 'diamonds_7', 'diamonds_8', 'diamonds_9', 'diamonds_10', 'diamonds_queen', 'diamonds_king', 'diamonds_ace', 'spades_jack',
  'diamonds_5', 'hearts_3', 'hearts_2', 'spades_2', 'spades_3', 'spades_4', 'spades_5', 'spades_6', 'spades_7', 'clubs_ace',
  'diamonds_4', 'hearts_4', 'diamonds_king', 'diamonds_ace', 'clubs_ace', 'clubs_king', 'clubs_queen', 'clubs_10', 'spades_8', 'clubs_king',
  'diamonds_3', 'hearts_5', 'diamonds_queen', 'hearts_queen', 'hearts_10', 'hearts_9', 'hearts_8', 'clubs_9', 'spades_9', 'clubs_queen',
  'diamonds_2', 'hearts_6', 'diamonds_10', 'hearts_king', 'hearts_3', 'hearts_2', 'hearts_7', 'clubs_8', 'spades_10', 'clubs_10',
  'spades_ace', 'hearts_7', 'diamonds_9', 'hearts_ace', 'hearts_4', 'hearts_5', 'hearts_6', 'clubs_7', 'spades_queen', 'clubs_9',
  'spades_king', 'hearts_8', 'diamonds_8', 'clubs_2', 'clubs_3', 'clubs_4', 'clubs_5', 'clubs_6', 'spades_king', 'clubs_8',
  'spades_queen', 'hearts_9', 'diamonds_7', 'diamonds_6', 'diamonds_5', 'diamonds_4', 'diamonds_3', 'diamonds_2', 'spades_ace', 'clubs_7',
  'spades_10', 'hearts_10', 'hearts_queen', 'hearts_king', 'hearts_ace', 'clubs_2', 'clubs_3', 'clubs_4', 'clubs_5', 'clubs_6',
  'clubs_jack', 'spades_9', 'spades_8', 'spades_7', 'spades_6', 'spades_5', 'spades_4', 'spades_3', 'spades_2', 'diamonds_jack',
  'hearts_jack', 'diamonds_jack', 'spades_jack', 'clubs_jack'
];


const params = new URLSearchParams(window.location.search);
const playerName = params.get("name") || "Player";
const playerColor = params.get("color") || "red";

let selectedCard = null;
let playerTurn = 1;
let sequences = { 1: 0, 2: 0 };

const board = document.getElementById('board');
const playerHand = document.getElementById('player-hand');
const yourTurnBanner = document.getElementById('your-turn-banner');
const cells = [];

function getCurrentColor() {
  return playerColor;
}

function updatePlayerDisplay() {
  const playerTable = document.querySelector(".player-info table");
  playerTable.innerHTML = `
    <tr><td><div class="chip small" style="background-color:${playerColor}"></div></td><td>${playerName}</td><td>${sequences[1]} Sequences</td></tr>
    <tr><td><div class="chip small" style="background-color:gray"></div></td><td>Opponent</td><td>${sequences[2]} Sequences</td></tr>
  `;
  yourTurnBanner.textContent = `${playerName}'s Turn`;
  yourTurnBanner.style.backgroundColor = playerColor;
}

function switchTurn() {
  playerTurn = playerTurn === 1 ? 2 : 1;
  updatePlayerDisplay();
}

function highlightMatchingCards(cardName) {
  document.querySelectorAll('.cell').forEach(cell => {
    if (cell.dataset.card === cardName && !cell.querySelector('.chip') && cell.dataset.permanent !== 'true') {
      cell.classList.add('highlight');
    } else {
      cell.classList.remove('highlight');
    }
  });
}

function drawCard() {
  const randomCard = cardList[Math.floor(Math.random() * cardList.length)];
  const img = document.createElement('img');
  img.src = `cards/${randomCard}.png`;
  img.dataset.card = randomCard;

  img.addEventListener('click', () => {
    document.querySelectorAll('.hand img').forEach(el => el.classList.remove('selected'));
    selectedCard = selectedCard === randomCard ? null : randomCard;
    if (selectedCard) img.classList.add('selected');
    highlightMatchingCards(randomCard);
  });

  playerHand.appendChild(img);
}

function removeSelectedCard() {
  const cardImg = document.querySelector(`#player-hand img[data-card="${selectedCard}"]`);
  if (cardImg) cardImg.remove();
  selectedCard = null;
  document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('highlight'));
  if (playerHand.children.length < 7) drawCard();
}

function highlightWinningSequence(chain) {
  chain.forEach(([r, c]) => {
    const cell = cells[r][c];
    cell.classList.add('sequence-glow');
  });
}

function checkForSequence(row, col, color) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

  for (const [dr, dc] of directions) {
    let chain = [[row, col]];

    for (let step = 1; step < 5; step++) {
      const r = row + dr * step;
      const c = col + dc * step;
      if (r < 0 || r >= 10 || c < 0 || c >= 10) break;
      const chip = cells[r][c]?.querySelector('.chip');
      if (!chip || chip.style.backgroundColor !== color) break;
      chain.push([r, c]);
    }

    for (let step = 1; step < 5; step++) {
      const r = row - dr * step;
      const c = col - dc * step;
      if (r < 0 || r >= 10 || c < 0 || c >= 10) break;
      const chip = cells[r][c]?.querySelector('.chip');
      if (!chip || chip.style.backgroundColor !== color) break;
      chain.push([r, c]);
    }

    if (chain.length >= 5) {
      highlightWinningSequence(chain);
      return true;
    }
  }

  return false;
}

// Build board
for (let i = 0; i < 10; i++) {
  const row = [];
  for (let j = 0; j < 10; j++) {
    const index = i * 10 + j;
    const card = cardList[index];
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.card = card;

    const img = document.createElement('img');
    img.src = [0, 9, 90, 99].includes(index) ? 'cards/sequence.png' : `cards/${card}.png`;
    img.classList.add('card');
    cell.appendChild(img);

    if ([0, 9, 90, 99].includes(index)) {
      const chip = document.createElement('div');
      chip.classList.add('chip');
      chip.style.backgroundColor = 'transparent';
      cell.appendChild(chip);
      cell.dataset.permanent = 'true';
    }

    cell.addEventListener('click', () => {
      if (!selectedCard || cell.dataset.permanent === 'true') return;

      const isJack = selectedCard.includes('jack');
      const isOneEyed = ['hearts_jack', 'spades_jack'].includes(selectedCard);
      const isTwoEyed = ['diamonds_jack', 'clubs_jack'].includes(selectedCard);
      const color = getCurrentColor();
      const chip = cell.querySelector('.chip');

      const handleSequence = () => {
        if (checkForSequence(i, j, color)) {
          sequences[playerTurn]++;
          setTimeout(() => alert(`🎉 ${playerName} formed a sequence!`), 100);

          if (sequences[playerTurn] >= 2) {
            setTimeout(() => {
              alert(`🏆 ${playerName} wins the game!`);
              document.body.innerHTML = `<h1 style="color:${color}; text-align:center; margin-top:100px;">🏆 ${playerName} Wins!</h1>`;
            }, 200);
          }
        }
      };

      if (isJack && isOneEyed) {
        if (chip && chip.style.backgroundColor !== color && chip.style.backgroundColor !== 'transparent') {
          chip.remove();
          removeSelectedCard();
          switchTurn();
        }
      } else if (isJack && isTwoEyed) {
        if (!chip) {
          const newChip = document.createElement('div');
          newChip.classList.add('chip');
          newChip.style.backgroundColor = color;
          cell.appendChild(newChip);
          removeSelectedCard();
          handleSequence();
          switchTurn();
        }
      } else {
        if (cell.dataset.card === selectedCard && !chip) {
          const newChip = document.createElement('div');
          newChip.classList.add('chip');
          newChip.style.backgroundColor = color;
          cell.appendChild(newChip);
          removeSelectedCard();
          handleSequence();
          switchTurn();
        }
      }
    });

    board.appendChild(cell);
    row.push(cell);
  }
  cells.push(row);
}

cardList.sort(() => 0.5 - Math.random()).slice(0, 7).forEach(drawCard);

// Toggle hand by mouse or 'c'
let keyCPressed = false;

document.addEventListener("mousemove", (e) => {
  if (keyCPressed) return;

  const rect = playerHand.getBoundingClientRect();
  const buffer = 60; // give some leeway

  const isNearHand =
    e.clientX >= rect.left - buffer &&
    e.clientX <= rect.right + buffer &&
    e.clientY >= rect.top - buffer &&
    e.clientY <= rect.bottom + buffer;

  playerHand.classList.toggle("visible", isNearHand);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "c") {
    keyCPressed = true;
    playerHand.classList.add("visible");
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "c") {
    keyCPressed = false;
    playerHand.classList.remove("visible");
  }
});

updatePlayerDisplay();

