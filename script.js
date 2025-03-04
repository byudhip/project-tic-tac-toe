"use strict";

// const d = document.querySelector('');
// const a = document.querySelector('');
// const b = document.querySelector('');
// const c = document.querySelector('');

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
    if (board[row][column].getValue() !== '') {
      return false;
    } else if (board[row][column].getValue() === '') {
      board[row][column].addToken(player);
      return true;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  const isBoardFilled = () => {
    const flatBoard = board.flat();
    const isFilled = flatBoard.every((cell) => cell.getValue() !== '');
    if (isFilled) {
      console.log("Board is filled, will check for the winner shortly...");
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

  return { getBoard, placeToken, printBoard, isBoardFilled, resetBoard };
}

function Cell() {
  let value = '';
  const addToken = (player) => {
    if (value === '') value = player;
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
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
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
      const [a, b, c] = pattern;

      if (
        gameBoard[a[0]][a[1]].getValue() !== 0 &&
        gameBoard[a[0]][a[1]].getValue() === gameBoard[b[0]][b[1]].getValue() &&
        gameBoard[a[0]][a[1]].getValue() === gameBoard[c[0]][c[1]].getValue()
      ) {
        return gameBoard[a[0]][a[1]].getValue();
      }
    }
    return null;
  };
  const playRound = (row, column) => {
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
    }
    const winner = checkForWinner();
    if (winner) {
      console.log(`Player ${winner} wins!`);
      board.resetBoard();
      printNewRound();
      return;
    }
    if (board.isBoardFilled()) {
      console.log("It's a tie");
      board.resetBoard();
      printNewRound();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    gameBoard
  };
}

function ScreenController () {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = '';
    const board = game.gameBoard;
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = colIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if (!selectedColumn && !selectedRow) return; // && !selectedRow) return;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();