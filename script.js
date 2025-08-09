const gameContainer = document.getElementById("gameContainer");
const scoreElement = document.getElementById("score");

let snake = [{ row: 20, col: 1 }];
let direction = "right";
let food = {};
let score = 0;
let gameInterval;

// Create 40x40 grid with unique ids
for (let i = 1; i <= 1600; i++) {
    let pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.id = "pixel" + i;
    gameContainer.appendChild(pixel);
}

// Convert row/col to pixel id
function getPixelId(row, col) {
    return "pixel" + ((row - 1) * 40 + col);
}

// Place food at random position
function placeFood() {
    let row = Math.floor(Math.random() * 40) + 1;
    let col = Math.floor(Math.random() * 40) + 1;
    food = { row, col };
    document.getElementById(getPixelId(row, col)).classList.add("food");
}

// Draw snake on the grid
function drawSnake() {
    document.querySelectorAll(".snakeBodyPixel").forEach(p => p.classList.remove("snakeBodyPixel"));
    snake.forEach(part => {
        document.getElementById(getPixelId(part.row, part.col)).classList.add("snakeBodyPixel");
    });
}

// Move snake
function moveSnake() {
    let head = { ...snake[0] };
    if (direction === "right") head.col++;
    if (direction === "left") head.col--;
    if (direction === "up") head.row--;
    if (direction === "down") head.row++;

    // Game over conditions
    if (head.row < 1 || head.row > 40 || head.col < 1 || head.col > 40 || snake.some(s => s.row === head.row && s.col === head.col)) {
        alert("Game Over! Final Score: " + score);
        clearInterval(gameInterval);
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.row === food.row && head.col === food.col) {
        score++;
        scoreElement.textContent = score;
        document.getElementById(getPixelId(food.row, food.col)).classList.remove("food");
        placeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

// Handle key events
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

// Initialize game
function startGame() {
    snake = [{ row: 20, col: 1 }];
    direction = "right";
    score = 0;
    scoreElement.textContent = score;
    document.querySelectorAll(".food, .snakeBodyPixel").forEach(p => p.classList.remove("food", "snakeBodyPixel"));
    placeFood();
    drawSnake();
    gameInterval = setInterval(moveSnake, 100);
}

startGame();
