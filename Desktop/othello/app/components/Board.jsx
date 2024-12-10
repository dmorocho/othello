"use client"
import { useState, useEffect } from "react";

const BOARD_SIZE = 8;
const EMPTY = null;
const BLACK = "B";
const WHITE = "W";

const Board = () => {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const initialBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(EMPTY)
    );

    // Set initial 4 pieces
    initialBoard[3][3] = WHITE;
    initialBoard[3][4] = BLACK;
    initialBoard[4][3] = BLACK;
    initialBoard[4][4] = WHITE;

    setBoard(initialBoard);
  };

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  const isValidMove = (row, col, player) => {
    if (board[row][col] !== EMPTY) return false;

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let foundOpponent = false;

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (board[x][y] === (player === BLACK ? WHITE : BLACK)) {
          foundOpponent = true;
        } else if (board[x][y] === player && foundOpponent) {
          return true;
        } else {
          break;
        }
        x += dx;
        y += dy;
      }
    }

    return false;
  };

  const makeMove = (row, col) => {
    if (!isValidMove(row, col, currentPlayer)) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let cellsToFlip = [];

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (newBoard[x][y] === (currentPlayer === BLACK ? WHITE : BLACK)) {
          cellsToFlip.push([x, y]);
        } else if (newBoard[x][y] === currentPlayer) {
          for (let [fx, fy] of cellsToFlip) {
            newBoard[fx][fy] = currentPlayer;
          }
          break;
        } else {
          break;
        }
        x += dx;
        y += dy;
      }
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
  };

  return (
    <div>
      <h1>Othello</h1>
      <h2>Current Player: {currentPlayer === BLACK ? "Black" : "White"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)` }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => makeMove(rowIndex, colIndex)}
              style={{
                width: 40,
                height: 40,
                border: "1px solid #444",
                backgroundColor: cell === BLACK ? "black" : cell === WHITE ? "white" : "green",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
