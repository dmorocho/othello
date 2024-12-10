"use client";

import { useState, useEffect } from "react";

const BOARD_SIZE = 8;
const EMPTY = null;
const BLACK = "B";
const WHITE = "W";

const Board = () => {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [validMoves, setValidMoves] = useState([]);
  const [flippedCells, setFlippedCells] = useState([]);
  const [blackCount, setBlackCount] = useState(2);
  const [whiteCount, setWhiteCount] = useState(2);

  useEffect(() => {
    initializeBoard();
  }, []);

  useEffect(() => {
    calculateValidMoves();
    countPieces();
  }, [board, currentPlayer]);

  const initializeBoard = () => {
    const initialBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(EMPTY)
    );

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
    if (
      row < 0 ||
      row >= BOARD_SIZE ||
      col < 0 ||
      col >= BOARD_SIZE ||
      !board[row] ||
      board[row][col] !== EMPTY
    ) {
      return false;
    }

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

  const calculateValidMoves = () => {
    const moves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(row, col, currentPlayer)) {
          moves.push([row, col]);
        }
      }
    }
    setValidMoves(moves);
  };

  const countPieces = () => {
    let black = 0;
    let white = 0;

    if (board.length > 0) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (board[row]) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === BLACK) black++;
            if (board[row][col] === WHITE) white++;
          }
        }
      }
    }

    setBlackCount(black);
    setWhiteCount(white);
  };

  const makeMove = (row, col) => {
    if (!isValidMove(row, col, currentPlayer)) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;

    const newFlippedCells = [];

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
            newFlippedCells.push([fx, fy]);
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
    setFlippedCells(newFlippedCells);

    setTimeout(() => setFlippedCells([]), 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Othello</h1>
      <h2>Current Player: {currentPlayer === BLACK ? "Black" : "White"}</h2>
      <h3>Black Pieces: {blackCount} | White Pieces: {whiteCount}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 60px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 60px)`,
          gap: "2px",
          padding: "10px",
          backgroundColor: "#2e8b57",
          borderRadius: "8px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
            const isFlipped = flippedCells.some(([r, c]) => r === rowIndex && c === colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => makeMove(rowIndex, colIndex)}
                style={{
                  width: "60px",
                  height: "60px",
                  border: "1px solid #444",
                  backgroundColor: cell === BLACK ? "black" : cell === WHITE ? "white" : isMove ? "rgba(0, 255, 0, 0.3)" : "green",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                  transition: "transform 0.5s ease-in-out",
                  perspective: "1000px",
                }}
              >
                {cell && (
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: cell === BLACK ? "black" : "white",
                    }}
                  />
                )}
                {isMove && (
                  <div
                    style={{
                      position: "absolute",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 255, 0, 0.5)",
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;