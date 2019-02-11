/* 
Neural Line
Gambler js
@author Darik Hart
@git https://github.com/neuralline


Late night challenge 2019  */

/* const dice = ["Ace", "King", "Queen", "Jack", 10, 9];*/

const submit = document.getElementById("submit");
const selectPlayers = document.getElementById("selectPlayers");
const rollButton = document.getElementById("rollButton");
const cardHolder = document.getElementById("cardHolder");
const introScreen = document.getElementById("introScreen");
const remainingRollsButton = document.getElementById("remainingRollsButton");

const createDiv = data => {
  let playerStatsCard = document.createElement("div");
  playerStatsCard.id = `playerStatsCard${data.id}`;
  playerStatsCard.innerHTML = `        
          <p class="title">Player ${data.id}</p>
          <div>
              ${data.hands.map(hand => "<div class='dice'>" + hand + "</div>")}
          </div>
          <p  id='playerScore${data.id}'>
           ${data.score}
          </p>
          <p class="pars" id='playerScore${data.id}'>
           ${data.par}
          </p>
            <div class="button">
              <button type="submit" id="${data.id}" class="roll">Hold</button>
            </div>
       `;
  return playerStatsCard;
};

const createCardContainer = data => {
  let container = document.createElement("div");
  container.className = "card";
  container.id = `player${data.id}Card`;
  return container;
};

class JSCard {
  constructor(id) {
    this.id = id || 0;
    this.diceInFull = ["Ace", "King", "Queen", "Jack", "10", "9"];
    this.dice = ["A", "K", "Q", "J", "10", "9"];
    this.numberOfRolls = 5;
    this.pars = {
      A: 0,
      K: 0,
      Q: 0,
      J: 0,
      "10": 0,
      "9": 0
    };
    this.hands = [];
    this.score = 0;
    this.scoreSet = new Set();
    this.parList = [
      "Bust",
      "One pair",
      "Two pair",
      "Three of a kind",
      "Straight",
      "Full house",
      "Four of a kind",
      "Five of a kind"
    ];
  }

  rollDice() {
    return this.dice[Math.floor(Math.random() * this.dice.length)];
  }

  selectHands() {
    for (let i = 0; i < this.numberOfRolls; i++) {
      this.hands.push(this.rollDice());
    }
    return this.hands;
  }

  finalScore() {
    this.hands.map(dice => this.pars[dice]++ || 0);
    for (const dice in this.pars) {
      this.pars[dice] > 1
        ? ((this.score += this.pars[dice]), this.scoreSet.add(dice))
        : false;
    }
    //score adjustment
    if (this.score === 5 && this.scoreSet.size === 1) this.score = 7;
    if (this.score === 4 && this.scoreSet.size === 1) this.score = 6;
    if (this.score === 5 && this.scoreSet.size === 2) this.score = 5;
    if (this.hands.join("") === "AKQJ10") this.score = 4;
    if (this.score === 4 && this.scoreSet.size === 2) this.score = 2;
    if (this.score === 2 && this.scoreSet.size === 1) this.score = 1;

    return this.score;
  }
  parScore() {
    return this.parList[this.score];
  }
  newHands() {
    return {
      id: this.id,
      hands: this.selectHands(),
      score: this.finalScore(),
      par: this.parScore()
    };
  }
}

class Player {
  constructor(id) {
    this.id = id || 0;
    this.stats = {};
    this.chances = 0;
    this.winner = false;
  }

  playGame() {
    this.chances++;
    this.game = new JSCard(this.id);
    return this.game.newHands();
  }
  chancesLeft() {
    return this.chances;
  }
}

class Game {
  constructor(id) {
    this.id = id || "";
    this.numberOfPlayers = 2;
    this.player = {};
    this.playerStats = {};
    this.playersID = new Set();
    this.remainingPlayers = new Set();
    this.elements = {};
    this.remainingRolls = 3;
    this.remainingRollsButton = remainingRollsButton;
  }
  preparePlayers(number) {
    this.numberOfPlayers = number || 2;
    cardHolder.innerHTML = "";
    cardHolder.style.display = "grid";
    rollButton.style.display = "grid";
    introScreen.style.display = "none";

    for (let id = 0; id < this.numberOfPlayers; id++) {
      this.player[id] = new Player(id);
      this.playerStats[id] = this.player[id].playGame();
      this.elements[id] = createCardContainer(this.playerStats[id]);
      this.elements[id].appendChild(createDiv(this.playerStats[id]));
      this.playersID.add(`${id}`);
      cardHolder.appendChild(this.elements[id]);
    }
    this.remainingPlayers = new Set(this.playersID);
    this.remainingRollsButton.innerHTML = this.remainingRolls;
  }

  reRollDice() {
    if (this.remainingRolls < 1) return this.endGame();
    for (const id of this.remainingPlayers) {
      this.elements[id].innerHTML = "";
      this.playerStats[id] = this.player[id].playGame();
      this.elements[id].appendChild(createDiv(this.playerStats[id]));
    }

    for (const id of this.playersID) {
      this.elements[id].getElementsByClassName("roll")[0].style = "";
    }
    this.remainingPlayers = new Set(this.playersID);
    this.remainingRolls--;
    if (this.remainingRolls > 0) {
      this.remainingRollsButton.innerHTML = this.remainingRolls;
    } else {
      this.remainingRollsButton.innerHTML = "replay";
      this.totalScore();
    }
  }

  remain(id) {
    console.log(id);
    console.log(this.remainingPlayers);
    this.remainingPlayers.delete(id);
    console.log(this.remainingPlayers);
  }
  startGame() {
    console.log("ready player one");
    cardHolder.style.display = "none";
    rollButton.style.display = "none";
    introScreen.style.display = "grid";
  }
  resetGame() {
    this.elements = {};
    this.playersID = new Set();
    this.player = {};
    this.playerStats = {};
    this.remainingRolls = 3;
  }
  totalScore() {
    let highestScore = [];
    let lowestScore = -1;
    let message = "WINNER";
    let color = "green";
    for (const user in this.playerStats) {
      if (this.playerStats[user].score > lowestScore) {
        lowestScore = this.playerStats[user].score;
        highestScore = [this.playerStats[user].id];
        message = "WINNER";
        color = "green";
      } else if (this.playerStats[user].score === lowestScore) {
        highestScore.push(this.playerStats[user].id);
        message = "DRAW";
        color = "orange";
      }
    }
    highestScore.map(id => {
      this.elements[id].getElementsByClassName("roll")[0].innerHTML = message;
      this.elements[id].getElementsByClassName(
        "roll"
      )[0].style.backgroundColor = color;
    });
  }

  endGame() {
    this.resetGame();
    this.startGame();
  }
}

const readyPlayerOne = new Game("Roll of Dice");
readyPlayerOne.startGame();

rollButton.addEventListener("click", e => {
  e.preventDefault();
  readyPlayerOne.reRollDice();
});

submit.addEventListener("click", e => {
  e.preventDefault();
  readyPlayerOne.preparePlayers(selectPlayers.value);
});

cardHolder.addEventListener("click", e => {
  e.preventDefault();
  const remainButton = e.target.closest("button.roll");
  if (!remainButton) return false;
  remainButton.style.backgroundColor = "rgb(92, 33, 33)";
  readyPlayerOne.remain(remainButton.id);
});
