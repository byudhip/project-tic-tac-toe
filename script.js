"use strict";
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() !== "") {
      return false;
    } else if (board[row][column].getValue() === "") {
      board[row][column].addToken(player);
      return true;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(boardWithCellValues);
  };

  const isBoardFilled = () => {
    const flatBoard = board.flat();
    const isFilled = flatBoard.every((cell) => cell.getValue() !== "");
    if (isFilled) {
      console.log("Board is filled, will check for the result shortly...");
      return isFilled;
    }
  };

  const resetBoard = () => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        board[row][col] = Cell(); // Create a new Cell object
      }
    }
  };

  const newGameModal = () => {
    const modal = document.querySelector(".game-modal");
    modal.showModal();
  };

  return {
    getBoard,
    placeToken,
    printBoard,
    isBoardFilled,
    resetBoard,
    newGameModal,
  };
}

function Cell() {
  let value = "";
  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const gameBoard = board.getBoard(); //to get the actual value of the 2D array

  const players = [
    {
      name: playerOneName,
      token: "O",
      color: "red",
    },
    {
      name: playerTwoName,
      token: "X",
      color: "blue",
    },
  ];
  const setPlayerAttributes = (chosenToken, playerOneName, playerTwoName) => {
    players[0].name = playerOneName;
    players[1].name = playerTwoName;
    players[0].token = chosenToken;
    players[1].token = chosenToken === "O" ? "X" : "O";
    players[0].color = chosenToken === "O" ? "red" : "blue";
    players[1].color = chosenToken === "O" ? "blue" : "red";
    console.log(players[0].name);
  };

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const getPlayers = () => players;
  let result;
  const setResult = (message) => {
    result = message;
  };
  const printNewRound = () => {
    setResult(`${getActivePlayer().name}'s turn`);
    board.printBoard();
    console.log(`${result}`);
  };
  const checkForWinner = () => {
    const winningPatterns = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],

      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],

      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    for (const pattern of winningPatterns) {
      const boardState = board.getBoard();
      const [a, b, c] = pattern;
      const first = boardState[a[0]][a[1]].getValue();
      const second = boardState[b[0]][b[1]].getValue();
      const third = boardState[c[0]][c[1]].getValue();
      if (first !== "" && first === second && first === third) {
        console.log(`${first} is the winner`);
        return first === "O" ? "One" : "Two";
      }
    }
    console.log("No winner found, resuming the match");
    return null;
  };

  const gameFinished = () => {
    const modal = document.createElement("dialog");
    modal.classList.add("game-modal");
    modal.innerHTML = `
          <form method="dialog">
            <p>${getResult()}</p>
            <p>Reset game? </p>
            <button>Confirm</button>
          </form>
        `;
    document.body.appendChild(modal);
    modal.showModal();
    modal.addEventListener("close", () => {
      document.querySelector(".turn").textContent =
        "Waiting for player details";
      resetGame();
    });
  };

  const resetGame = () => {
    board.resetBoard();
    board.newGameModal();
  };

  const playRound = (row, column) => {
    console.log("board state before token placement");
    console.table(board.printBoard());
    if (!board.placeToken(row, column, getActivePlayer().token)) {
      console.log("Invalid move, please choose an empty cell");
      return printNewRound();
    } else {
      console.log(
        `Placing ${getActivePlayer().name}'s ${
          getActivePlayer().token
        } into ${row}, ${column}...`
      );
      board.placeToken(row, column, getActivePlayer().token);
      console.log("after token placement");
    }
    const winner = checkForWinner();
    if (winner) {
      setResult(`${getActivePlayer().name} wins!`);
      console.log(`${result} is win`);
      gameFinished();
      return;
    }
    if (board.isBoardFilled()) {
      setResult("It's a tie");
      gameFinished();
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };
  const getResult = () => result;
  board.newGameModal();
  setResult("Waiting for player details");

  return {
    setPlayerAttributes,
    resetGame,
    playRound,
    getActivePlayer,
    getPlayers,
    gameBoard,
    setResult,
    getResult,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const modal = document.querySelector(".game-modal");
  const playerOneName = document.querySelector("#player-one-name");
  const playerTwoName = document.querySelector("#player-two-name");

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.gameBoard;
    playerTurnDiv.textContent = game.getResult();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = colIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = cell.getValue();
        const player = game
          .getPlayers()
          .find((p) => p.token === cell.getValue()); //get the player object according to their token
        if (player) {
          cellButton.style.color = player.color; // color the cell text according to color property in player object
        }
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if (!selectedColumn && !selectedRow) return;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  function clickHandlerModal(e) {
    if (e.target.classList.contains("submit")) {
      const chosenToken = e.target.value;
      const p1 = playerOneName.value || "Player One";
      const p2 = playerTwoName.value || "Player Two";
      modal.close();
      game.setPlayerAttributes(chosenToken, p1, p2);
      game.setResult(`${p1}'s turn`);
      updateScreen();
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  modal.addEventListener("click", clickHandlerModal);

  updateScreen();
}

ScreenController();
