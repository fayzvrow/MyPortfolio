let images = [
    "buzzard.jpg", "cat.jpg", "dog.jpg", 
    "fish.jpg", "giraffe.jpg", "lion.jpg",
    "ape.jpg", "frog.jpg", "zebra.jpg",
    "llama.jpg", "snail.jpg", "leopard.jpg"
];

let board = document.getElementById("gameBoard");
let timerDisplay = document.getElementById("timer");
let message = document.getElementById("message");
let scoreDisplay = document.getElementById("score");
let leaderboardList = document.getElementById("leaderboard");

let cards = [];
let firstCard = null;
let secondCard = null;
let offBoard = false;
let remainingTime = 0;
let matchedPairs = 0;
let timer;
let score = 0;

function startGame() {
    document.getElementById("scoreboard").style.display = "block";
    
    board.innerHTML = "";
    firstCard = null;
    secondCard = null;
    offBoard = false;
    matchedPairs = 0;
    score = 0;
    scoreDisplay.textContent = score;
    message.textContent = "";

    let difficulty = parseInt(document.getElementById("difficulty").value);
    let numPairs = parseInt(document.getElementById("numPairs").value);

    if (numPairs === 8) remainingTime = 120;
    else if (numPairs === 10) remainingTime = 150;
    else remainingTime = 180;

    timerDisplay.textContent = "Time Left: " + remainingTime;

    let chosenImages = images.slice(0, numPairs);
    let cardImages = [...chosenImages, ...chosenImages];
    cardImages.sort(() => Math.random() - 0.5);

    board.style.gridTemplateColumns = `repeat(4, 110px)`;

    cardImages.forEach((img, index) => {
        let div = document.createElement("div");
        div.classList.add("card");
        div.dataset.image = img;
        div.innerHTML = `<img src="images/${img}">`;
        div.addEventListener("click", () => flipCard(div));
        board.appendChild(div);
    });

    setTimeout(() => {
        hideAllCards();
        startTimer();
    }, difficulty * 1000);
}

function hideAllCards() {
    let allCards = document.querySelectorAll(".card img");
    allCards.forEach(img => img.style.display = "none");

    let cardDivs = document.querySelectorAll(".card");
    cardDivs.forEach((card, index) => {
        card.dataset.number = index + 1;
        card.textContent = index + 1;
    });
}

function flipCard(card) {
    if (offBoard || card.classList.contains("matched")) return;

    let img = card.dataset.image;
    card.innerHTML = `<img src="images/${img}">`;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    offBoard = true;

    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;
        score += 10;
        scoreDisplay.textContent = score;

        if (matchedPairs === parseInt(document.getElementById("numPairs").value)) {
            clearInterval(timer);
            offBoard = true;
            endGame();
        }
        resetTurn();
    } else {
        score -= 5;
        scoreDisplay.textContent = score;

        setTimeout(() => {
            firstCard.textContent = firstCard.dataset.number;
            secondCard.textContent = secondCard.dataset.number;
            resetTurn();
        }, 900);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    offBoard = false;
}

function startTimer() {
    timer = setInterval(() => {
        remainingTime--;

        if (remainingTime <= 0) {
            remainingTime = 0;
            timerDisplay.textContent = "Time: 0";
            clearInterval(timer);
            offBoard = true;
            endGame(true);
            return;
        }

        timerDisplay.textContent = "Time: " + remainingTime;
    }, 1000);
}

function endGame(timeUp = false) {
    if (timeUp) alert("Time is up!");
    else alert("You won :)");

    let playerName = prompt("Enter your name for the leaderboard:", "Player");
    if (!playerName) playerName = "Player";

    saveScore(playerName, score);
    displayLeaderboard();
}

function saveScore(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("mmgLeaderboard")) || [];
    leaderboard.push({name, score});
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("mmgLeaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("mmgLeaderboard")) || [];
    leaderboardList.innerHTML = "";
    leaderboard.forEach(entry => {
        let li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

displayLeaderboard();

document.getElementById("startButton").addEventListener("click", startGame);
