const buttons = document.querySelectorAll('.btn');
const message = document.getElementById('message');
const startBtn = document.getElementById('start');

let sequence = [];
let playerSequence = [];
let round = 0;
let waitingForInput = false;
const maxRounds = 5;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playSequence() {
  waitingForInput = false;
  message.textContent = `Watch the pattern (Round ${round})`;
  for (let color of sequence) {
    const btn = document.querySelector(`.btn.${color}`);
    btn.classList.add('active');
    await sleep(600);
    btn.classList.remove('active');
    await sleep(200);
  }
  waitingForInput = true;
  message.textContent = 'Your turn!';
  playerSequence = [];
}

function nextRound() {
  round++;
  if (round > maxRounds) {
    winGame();
    return;
  }
  const colors = ['green', 'red', 'yellow', 'blue'];
  let nextColor;
  do {
    nextColor = colors[Math.floor(Math.random() * colors.length)];
  } while (sequence.length > 0 && nextColor === sequence[sequence.length - 1]);
  sequence.push(nextColor);
  playSequence();
}

function gameOver() {
  const finalRound = round;
  message.textContent = `Game Over! You reached round ${finalRound}. Tap Start to play again.`;
  resetGame();
}

function winGame() {
  message.textContent = `🎉 You Won! Game Over! You reached round ${maxRounds}. Tap Start to play again.`;
  resetGame();
}

function resetGame() {
  sequence = [];
  playerSequence = [];
  round = 0;
  waitingForInput = false;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (!waitingForInput) return;
    const color = button.dataset.color;
    playerSequence.push(color);

    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 300);

    let currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
      gameOver();
      return;
    }

    if (playerSequence.length === sequence.length) {
      waitingForInput = false;
      if (round === maxRounds) {
        winGame();
      } else {
        message.textContent = 'Well done! Next round...';
        setTimeout(nextRound, 1000);
      }
    }
  });
});

startBtn.addEventListener('click', () => {
  if (waitingForInput) return;
  sequence = [];
  playerSequence = [];
  round = 0;
  nextRound();
});
