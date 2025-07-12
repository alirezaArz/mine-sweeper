"use strict";

const boardContainer = document.getElementById("board-container");
const difficultyBtns = ["easy-btn", "medium-btn", "hard-btn"];
let colums;
let rows;
let bombsCount;
let bombs = [];
let blockId = 1;
let allCells = [];
let flagCount = 0;
let revealedCnt = 0;

for (let item of difficultyBtns) {
  document.getElementById(item).addEventListener("click", function () {
    if (item === "easy-btn") {
      colums = 9;
      rows = 9;
      bombsCount = 10;
    } else if (item === "medium-btn") {
      colums = 15;
      rows = 15;
      bombsCount = 40;
    } else {
      colums = 15;
      rows = 30;
      bombsCount = 99;
    }
    prepareToStart();
  });
}

function prepareToStart() {
  blockId = 1;
  bombs = [];
  boardContainer.innerHTML = "";
  allCells = [];
  picbombsCount();
  flagCount = 0;
  revealedCnt = 0;

  document.getElementById("mines-left").textContent = bombsCount - flagCount;
  document.getElementById("main-menu").classList.remove("active");
  boardContainer.style.gridTemplateColumns = `repeat(${colums}, 1fr)`;
  boardContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (let col = 0; col < colums; col++) {
    for (let row = 0; row < rows; row++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      boardContainer.appendChild(cell);
      cell.srow = row + 1;
      cell.scolum = col + 1;
      cell.id = blockId;
      blockId += 1;
      cell.flagged = false;

      cell.addEventListener("contextmenu", function (e) {
        event.preventDefault();
        if (cell.flagged == false && flagCount < bombsCount) {
          cell.classList.add("flagged");
          cell.flagged = true;
          flagCount += 1;
          //console.log(e);
        } else if (cell.flagged == true) {
          cell.classList.remove("flagged");
          cell.flagged = false;
          flagCount -= 1;
          //console.log(e);
        }
        document.getElementById("mines-left").textContent =
          bombsCount - flagCount;
      });

      cell.addEventListener("click", function () {
        if (cell.flagged == false) {
          cell.classList.remove("flagged");
          cell.classList.add("revealed");
          cell.flagged = true;
          console.log(cell.id);

          if (bombs.includes(Number(cell.id))) {
            //console.log("bomb here");
            cell.classList.remove("flagged");
            cell.classList.add("exploded-mine");
            cell.flagged = true;
            revealBombs();
            document.getElementById("final-result").textContent =
              "بوم! 💥 مین منفجر شد!...  باختی!";
          } else {
            revealedCnt += 1;

            if (revealedCnt === rows * colums - bombsCount) {
              console.log("you won");
              revealBombs();
              document.getElementById("final-result").textContent =
                "تبریک! 🎉 همه مین‌ها رو پیدا کردی!";
            }
            const bombsAround = recBombs(
              Number(cell.id),
              Number(cell.scolum),
              Number(cell.srow)
            );
            cell.textContent = bombsAround;
            cell.classList.add(`number-${bombsAround}`);
          }
        }
      });
    }
  }
  allCells = document.querySelectorAll(".cell");
  document.getElementById("game-board-screen").classList.add("active");
}

function recBombs(id, scolum, srow) {
  //console.log(`id = ${id} scolum = ${scolum} srow = ${srow}`)
  let cnt = 0;
  let locmakers = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];

  for (let item of locmakers) {
    let newBlockLocation = [scolum + item[0], srow + item[1]];
    let newBlockid;
    for (let cell of allCells) {
      if (
        cell.scolum == newBlockLocation[0] &&
        cell.srow == newBlockLocation[1]
      ) {
        //console.log(`nighbers: id = ${cell.id}`)
        newBlockid = Number(cell.id);
      }
    }
    if (bombs.includes(newBlockid)) {
      //console.log(`${newBlockid} is bomb`)
      cnt += 1;
      //.log(cnt)
    }
  }
  //console.log(`fianl cnt is = ${cnt}`)
  return cnt;
}


function picbombsCount() {
  bombs = [];
  for (let i = 0; i < bombsCount; i++) {
    let newVal = Math.trunc(Math.random() * (colums * rows) + 1);
    while (bombs.includes(newVal)) {
      newVal = Math.trunc(Math.random() * (colums * rows) + 1);
    }
    bombs.push(newVal);
  }
  console.log(bombs);
}

function revealBombs() {
  //console.log("you lost");
  for (let item of allCells) {
    if (bombs.includes(Number(item.id))) {
      item.classList.add("mine");
      item.classList.add("revealed");
    }
  }
}

function restart() {
  boardContainer.innerHTML = "";
  document.getElementById("lose-screen").classList.remove("active");
  document.getElementById("game-board-screen").classList.remove("active");
  document.getElementById("win-screen").classList.remove("active");

  document.getElementById("main-menu").classList.add("active");
}

document
  .getElementById("play-again-win-btn")
  .addEventListener("click", restart);
document
  .getElementById("play-again-lose-btn")
  .addEventListener("click", restart);
document.getElementById("reset-btn").addEventListener("click", restart);
