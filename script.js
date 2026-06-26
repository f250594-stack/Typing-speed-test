const paragraphs = {
  easy: [
    "The sun rises in the east and sets in the west every day.",
    "Cats and dogs are the most common pets in the world.",
    "She sells sea shells by the sea shore near the beach.",
  ],
  medium: [
    "Programming is the process of creating instructions that computers can follow to perform specific tasks.",
    "The quick brown fox jumps over the lazy dog near the river bank on a sunny afternoon.",
    "Learning to code takes time and practice but the results are always worth the effort.",
  ],
  hard: [
    "Algorithms and data structures form the backbone of computer science and software engineering disciplines worldwide.",
    "The complexity of modern software systems requires developers to continuously adapt and learn new technologies and frameworks.",
    "Multivariable calculus extends the concepts of single variable calculus to functions of multiple variables in mathematics.",
  ]
};

let currentLevel = 'easy';
let currentParagraph = '';
let timer = 60;
let timerInterval = null;
let isRunning = false;
let totalTyped = 0;
let correctTyped = 0;

const paragraphBox = document.getElementById('paragraphBox');
const inputBox = document.getElementById('inputBox');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const highScoreDisplay = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');
const diffBtns = document.querySelectorAll('.diff-btn');

// Load high score from localStorage
highScoreDisplay.textContent = localStorage.getItem('highScore') || 0;

// Render paragraph with individual letter spans
function renderParagraph() {
  paragraphBox.innerHTML = '';
  currentParagraph.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    if (index === 0) span.classList.add('current');
    paragraphBox.appendChild(span);
  });
}

// Load a random paragraph based on difficulty
function loadParagraph() {
  const list = paragraphs[currentLevel];
  currentParagraph = list[Math.floor(Math.random() * list.length)];
  renderParagraph();
}

// Start timer when user starts typing
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  inputBox.disabled = false;

  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;

    if (timer === 0) {
      endTest();
    }
  }, 1000);
}

// End the test
function endTest() {
  clearInterval(timerInterval);
  inputBox.disabled = true;
  isRunning = false;

  // Save high score
  const currentWPM = parseInt(wpmDisplay.textContent);
  const savedHigh = parseInt(localStorage.getItem('highScore')) || 0;
  if (currentWPM > savedHigh) {
    localStorage.setItem('highScore', currentWPM);
    highScoreDisplay.textContent = currentWPM;
  }
}

// Calculate WPM and accuracy as user types
inputBox.addEventListener('input', () => {
  if (!isRunning) startTimer();

  const typedText = inputBox.value;
  const spans = paragraphBox.querySelectorAll('span');

  totalTyped = typedText.length;
  correctTyped = 0;

  // Color each letter
  spans.forEach((span, index) => {
    span.classList.remove('correct', 'wrong', 'current');

    if (index < typedText.length) {
      if (typedText[index] === currentParagraph[index]) {
        span.classList.add('correct');
        correctTyped++;
      } else {
        span.classList.add('wrong');
      }
    } else if (index === typedText.length) {
      span.classList.add('current');
    }
  });

  // Calculate WPM (standard: 5 characters = 1 word)
  const timeElapsed = (60 - timer) || 1;
  const words = correctTyped / 5;
  const wpm = Math.round((words / timeElapsed) * 60);
  wpmDisplay.textContent = wpm > 0 ? wpm : 0;

  // Calculate accuracy
  const accuracy = totalTyped > 0
    ? Math.round((correctTyped / totalTyped) * 100)
    : 100;
  accuracyDisplay.textContent = accuracy;

  // Auto end if paragraph is fully typed
  if (typedText.length === currentParagraph.length) {
    endTest();
  }
});

// Restart button
restartBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timer = 60;
  isRunning = false;
  totalTyped = 0;
  correctTyped = 0;

  timerDisplay.textContent = 60;
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 100;

  inputBox.value = '';
  inputBox.disabled = false;
  inputBox.focus();

  loadParagraph();
});

// Difficulty buttons
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    diffBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = btn.dataset.level;
    restartBtn.click();
  });
});

// Initial load
loadParagraph();
inputBox.disabled = false;