let secretNum;
let remainingGuesses = 10;

const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const message = document.getElementById("message");
const remainingText = document.getElementById("remaining");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function newGame() {
    secretNum = Math.floor(Math.random() * 100) + 1;
    remainingGuesses = 10;
    remainingText.textContent = remainingGuesses;
    input.value = "";
}

function checkGuess() {
    const userGuess = Number(input.value);

    if (!userGuess || userGuess < 1 || userGuess > 100) {
        message.textContent = "Enter a number between 1 and 100.";
        return;
    }

    remainingGuesses--;
    remainingText.textContent = remainingGuesses;

    if (userGuess === secretNum) {
        message.textContent = "Correct!";
        correctSound.play();
        setTimeout(newGame, 1500);
        return;
    }

    if (userGuess > secretNum) {
        message.textContent = "Too high!";
    } else {
        message.textContent = "Too low!";
    }

    wrongSound.play();

    if (remainingGuesses === 0) {
        message.textContent = `No more guesses. The number was ${secretNum}.`;
        setTimeout(newGame, 2000);
    }
}

button.addEventListener("click", checkGuess);

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    document.getElementById("clock").textContent = time;
}

setInterval(updateClock, 1000);
updateClock();

newGame();