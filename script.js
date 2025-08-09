(function(){
  const ROWS = 40;
  const COLS = 40;
  const TOTAL = ROWS * COLS;
  const container = document.getElementById('gameContainer');
  const scoreEl = document.getElementById('score');
  const lengthEl = document.getElementById('length');
  const statusEl = document.getElementById('gameStatus');
  const restartBtn = document.getElementById('restartBtn');

  // Create grid
  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement('div');
    div.className = 'pixel';
    div.id = 'pixel' + i;
    container.appendChild(div);
  }

  function rcToIndex(r, c){
    return (r - 1) * COLS + c;
  }

  function indexToRC(index) {
    const z = index - 1;
    const r = Math.floor(z / COLS) + 1;
    const c = (z % COLS) + 1;
    return { r, c };
  }

  let snake = [];
  let dir = 'right';
  let pendingDir = null;
  let score = 0;
  let intervalId = null;
  const TICK_MS = 100;
  let running = true;
  let foodIndex = null;

  function init() {
    for (let i = 1; i <= TOTAL; i++) {
      const e = document.getElementById('pixel' + i);
      e.classList.remove('snakeBodyPixel', 'food');
    }

    const startRow = 20;
    const startCol = 1;
    const startIndex = rcToIndex(startRow, startCol);
    snake = [startIndex];
    dir = 'right';
    pendingDir = null;
    score = 0;
    running = true;
    updateHUD();
    renderSnake();
    placeFood();

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(tick, TICK_MS);
    statusEl.textContent = 'Running';
  }

  function renderSnake() {
    for (let i = 1; i <= TOTAL; i++) {
      document.getElementById('pixel' + i).classList.remove('snakeBodyPixel');
    }
    snake.forEach(idx => {
      document.getElementById('pixel' + idx).classList.add('snakeBodyPixel');
    });
    lengthEl.textContent = snake.length;
  }

  function placeFood() {
    const occupied = new Set(snake);
    const empties = [];
    for (let i = 1; i <= TOTAL; i++) {
      if (!occupied.has(i)) empties.push(i);
    }
    if (empties.length === 0) {
      gameOver(true);
      return;
    }
    const pick = empties[Math.floor(Math.random() * empties.length)];
    foodIndex = pick;
    document.getElementById('pixel' + pick).classList.add('food');
  }

  function nextIndex(fromIndex, direction) {
    const { r, c } = indexToRC(fromIndex);
    let nr = r, nc = c;
    if (direction === 'up') nr--;
    if (direction === 'down') nr++;
    if (direction === 'left') nc--;
    if (direction === 'right') nc++;
    if (nr < 1 || nr > ROWS || nc < 1 || nc > COLS) return null;
    return rcToIndex(nr, nc);
  }

  function tick() {
    if (!running) return;
    if (pendingDir && !isReverse(dir, pendingDir)) {
      dir = pendingDir;
      pendingDir = null;
    }

    const head = snake[0];
    const ni = nextIndex(head, dir);
    if (ni === null || snake.includes(ni)) {
      gameOver(false);
      return;
    }

    snake.unshift(ni);
    const headEl = document.getElementById('pixel' + ni);

    if (ni === foodIndex) {
      score++;
      scoreEl.textContent = score;
      headEl.classList.remove('food');
      foodIndex = null;
      placeFood();
    } else {
      const tail = snake.pop();
      document.getElementById('pixel' + tail).classList.remove('snakeBodyPixel');
    }

    headEl.classList.add('snakeBodyPixel');
    lengthEl.textContent = snake.length;
  }

  function isReverse(current, next) {
    return (current === 'left' && next === 'right') ||
           (current === 'right' && next === 'left') ||
           (current === 'up' && next === 'down') ||
           (current === 'down' && next === 'up');
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key;
    let newDir = null;
    if (key === 'ArrowUp' || key === 'w' || key === 'W') newDir = 'up';
    if (key === 'ArrowDown' || key === 's' || key === 'S') newDir = 'down';
    if (key === 'ArrowLeft' || key === 'a' || key === 'A') newDir = 'left';
    if (key === 'ArrowRight' || key === 'd' || key === 'D') newDir = 'right';
    if (key === ' ' || key === 'Spacebar') {
      e.preventDefault();
      togglePause();
      return;
    }
    if (newDir && !isReverse(dir, newDir)) {
      pendingDir = newDir;
    }
  });

  function togglePause() {
    running = !running;
    statusEl.textContent = running ? 'Running' : 'Paused';
  }

  function gameOver(win) {
    running = false;
    statusEl.textContent = win ? 'You Win!' : 'Game Over';
    clearInterval(intervalId);
    intervalId = null;
  }

  function updateHUD() {
    scoreEl.textContent = score;
    lengthEl.textContent = snake.length;
  }

  restartBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    init();
  });

  init();
})();
