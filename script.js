const menu = document.getElementById('menu');
const gameScreen = document.getElementById('game');
const resultScreen = document.getElementById('result');
const gameTitle = document.getElementById('game-title');
const gameArea = document.getElementById('game-area');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const goalEl = document.getElementById('goal');
const highEl = document.getElementById('high');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const menuBtn = document.getElementById('menu-btn');
const restartBtn = document.getElementById('restart-btn');
const waifuComment = document.getElementById('waifu-comment');
const responseOptions = document.getElementById('response-options');
const waifuResponse = document.getElementById('waifu-response');

let currentMode = null;
let score = 0;
let timer = 0;
let intervalId = null;

const goalScores = {
  'click-speed': 30,
  'random-aim': 20
};

let highScores = JSON.parse(localStorage.getItem('highScores') || '{}');

function showScreen(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
  screen.classList.add('active');
}

function startGame(mode) {
  currentMode = mode;
  score = 0;
  timerEl.textContent = '';
  scoreEl.textContent = '';
  gameArea.innerHTML = '';
  gameTitle.textContent = mode === 'click-speed' ? 'Click Speed' : 'Random Aim';
  goalEl.textContent = `Goal: ${goalScores[mode]}`;
  highEl.textContent = `High: ${highScores[mode] || 0}`;
  showScreen(gameScreen);
}

function endGame() {
  clearInterval(intervalId);
  let high = highScores[currentMode] || 0;
  if (score > high) {
    highScores[currentMode] = score;
    localStorage.setItem('highScores', JSON.stringify(highScores));
    high = score;
  }

  const goal = goalScores[currentMode];
  let comment = '';
  if (score >= goal) {
    comment = `Goal achieved! You scored ${score}.`;
  } else {
    comment = `You scored ${score}. Goal is ${goal}. Keep practicing!`;
  }
  comment += ` High score: ${high}.`;

  waifuComment.textContent = comment;

  responseOptions.innerHTML = '';
  waifuResponse.classList.add('hidden');
  waifuResponse.textContent = '';
  const responses = {
    simp: 'Senpai! Your clicks make my heart race! ❤',
    nice: 'Great job out there! Let\'s keep improving together.',
    troll: 'Pfft, even my grandma clicks faster. Try harder.'
  };

  Object.entries(responses).forEach(([style, text]) => {
    const btn = document.createElement('button');
    btn.textContent = style === 'simp' ? 'Simp' : style === 'nice' ? 'Nice Guy' : 'Troll';
    btn.addEventListener('click', () => {
      waifuResponse.textContent = text;
      waifuResponse.classList.remove('hidden');
    });
    responseOptions.appendChild(btn);
  });

  showScreen(resultScreen);
}

function runClickSpeed() {
  const clickBtn = document.createElement('button');
  clickBtn.textContent = 'Click!';
  clickBtn.style.fontSize = '24px';
  gameArea.appendChild(clickBtn);
  clickBtn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = `Score: ${score}`;
  });

  timer = 5;
  timerEl.textContent = `Time: ${timer}`;
  intervalId = setInterval(() => {
    timer--;
    timerEl.textContent = `Time: ${timer}`;
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function runRandomAim() {
  timer = 15;
  timerEl.textContent = `Time: ${timer}`;

  const spawnTarget = () => {
    gameArea.innerHTML = '';
    const target = document.createElement('div');
    target.classList.add('target');
    target.style.left = Math.random() * (gameArea.clientWidth - 40) + 'px';
    target.style.top = Math.random() * (gameArea.clientHeight - 40) + 'px';
    target.addEventListener('click', () => {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      const delay = Math.max(300, 1000 - score * 50);
      setTimeout(spawnTarget, delay);
    });
    gameArea.appendChild(target);
  };

  spawnTarget();

  intervalId = setInterval(() => {
    timer--;
    timerEl.textContent = `Time: ${timer}`;
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

startBtn.addEventListener('click', () => {
  if (currentMode === 'click-speed') runClickSpeed();
  if (currentMode === 'random-aim') runRandomAim();
  startBtn.classList.add('hidden');
});

backBtn.addEventListener('click', () => {
  showScreen(menu);
});

menuBtn.addEventListener('click', () => {
  showScreen(menu);
});

restartBtn.addEventListener('click', () => {
  showScreen(gameScreen);
  startBtn.classList.remove('hidden');
  waifuResponse.classList.add('hidden');
  waifuResponse.textContent = '';
  startGame(currentMode);
});

menu.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    startGame(btn.dataset.mode);
    startBtn.classList.remove('hidden');
  });
});

