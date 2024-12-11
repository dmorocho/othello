'use client'
import React, {useState, useEffect} from 'react'
import WelcomeScreen from './WelcomeScreen'
import {getAIMove} from '../utils/aiPlayer'

const BOARD_SIZE = 8
const EMPTY = null
const BLACK = 'B'
const WHITE = 'W'

const Board = () => {
  const [board, setBoard] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(BLACK)
  const [showWelcome, setShowWelcome] = useState(true)
  const [validMoves, setValidMoves] = useState([])
  const [flippedCells, setFlippedCells] = useState([])
  const [blackCount, setBlackCount] = useState(2)
  const [whiteCount, setWhiteCount] = useState(2)
  // const [gameOver, setGameOver] = useState(false)
  const gameOver = false
  const [gameMode, setGameMode] = useState(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [obstacles, setObstacles] = useState([])

  useEffect(() => {
    initializeBoard()
  }, [])

  useEffect(() => {
    if ((gameMode === 'computer' || gameMode === 'obstaclesVsComputer') && currentPlayer === WHITE && !gameOver) {
      handleAIMove()
    }
  }, [currentPlayer, gameOver, gameMode])

  useEffect(() => {
    calculateValidMoves()
    countPieces()

    // Check if the current player has any valid moves
    if (!hasValidMoves(currentPlayer)) {
      const opponent = currentPlayer === BLACK ? WHITE : BLACK
      if (!hasValidMoves(opponent)) {
        console.log('No moves left for both players. Game over!')
        return
      }
      console.log(`${currentPlayer} has no valid moves. Switching to ${opponent}`)
      setCurrentPlayer(opponent)
    }
  }, [board, currentPlayer])

  const initializeBoard = (mode) => {
    const initialBoard = Array.from({length: BOARD_SIZE}, () => Array(BOARD_SIZE).fill(EMPTY))

    // Set initial pieces
    initialBoard[3][3] = WHITE
    initialBoard[3][4] = BLACK
    initialBoard[4][3] = BLACK
    initialBoard[4][4] = WHITE

    if (mode === 'obstacles' || mode === 'obstaclesVsComputer') {
      // Set random obstacles for both obstacle modes
      const obstacleCount = 5 // Define how many obstacles you want
      const obstaclePositions = new Set()

      while (obstaclePositions.size < obstacleCount) {
        const row = Math.floor(Math.random() * BOARD_SIZE)
        const col = Math.floor(Math.random() * BOARD_SIZE)

        // Ensure the position is empty and not already an obstacle
        if (initialBoard[row][col] === EMPTY) {
          initialBoard[row][col] = 'X' // Marking obstacles with 'X'
          obstaclePositions.add(`${row},${col}`) // Store the position as a string
        }
      }

      setObstacles(Array.from(obstaclePositions).map((pos) => pos.split(',').map(Number))) // Convert back to array of [row, col]
    }

    setBoard(initialBoard)
  }

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  const isValidMove = (row, col, player) => {
    if (
      row < 0 ||
      row >= BOARD_SIZE ||
      col < 0 ||
      col >= BOARD_SIZE ||
      !board[row] ||
      board[row][col] !== EMPTY ||
      board[row][col] === 'X'
    ) {
      return false
    }

    for (let [dx, dy] of directions) {
      let x = row + dx
      let y = col + dy
      let foundOpponent = false

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (board[x][y] === (player === BLACK ? WHITE : BLACK)) {
          foundOpponent = true
        } else if (board[x][y] === player && foundOpponent) {
          return true
        } else {
          break
        }
        x += dx
        y += dy
      }
    }

    return false
  }

  const handleAIMove = async () => {
    console.log('AI Turn Starting - Current Board State:', board)
    const aiMove = await getAIMove(board, currentPlayer)
    console.log('AI Returned Move:', aiMove)

    if (!aiMove) {
      console.log('AI returned null move')
      setCurrentPlayer(BLACK)
      return
    }

    const {row, col} = aiMove
    const isValid = isValidMove(row, col, currentPlayer)
    console.log('Is AI move valid?', isValid, 'at position:', row, col)

    if (isValid) {
      console.log('Making AI move at:', row, col)
      makeMove(row, col)
    } else {
      console.log('AI attempted invalid move at:', row, col)
      setCurrentPlayer(BLACK)
    }
  }

  const calculateValidMoves = () => {
    const moves = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(row, col, currentPlayer)) {
          moves.push([row, col])
        }
      }
    }
    setValidMoves(moves)
  }

  const countPieces = () => {
    let black = 0
    let white = 0

    if (board.length > 0) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (board[row]) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === BLACK) black++
            if (board[row][col] === WHITE) white++
          }
        }
      }
    }

    setBlackCount(black)
    setWhiteCount(white)
  }

  const makeMove = (row, col) => {
    if (!isValidMove(row, col, currentPlayer)) return

    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = currentPlayer

    const newFlippedCells = []

    for (let [dx, dy] of directions) {
      let x = row + dx
      let y = col + dy
      let cellsToFlip = []

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (newBoard[x][y] === (currentPlayer === BLACK ? WHITE : BLACK)) {
          cellsToFlip.push([x, y])
        } else if (newBoard[x][y] === currentPlayer) {
          for (let [fx, fy] of cellsToFlip) {
            newBoard[fx][fy] = currentPlayer
            newFlippedCells.push([fx, fy])
          }
          break
        } else {
          break
        }
        x += dx
        y += dy
      }
    }

    setBoard(newBoard)
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK)
    setFlippedCells(newFlippedCells)

    setTimeout(() => setFlippedCells([]), 500)
  }

  const hasValidMoves = (player) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(row, col, player)) {
          return true
        }
      }
    }
    return false
  }
  const isBoardFull = () => {
    return board.every((row) => row.every((cell) => cell !== EMPTY))
  }

  const startGame = (mode) => {
    setShowWelcome(false)
    setGameMode(mode)
    initializeBoard(mode)
  }

  return (
    <div>
      {showWelcome ? (
        <WelcomeScreen onStart={startGame} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <h1>Othello</h1>
          <h2>
            Current Player:
            {gameMode === 'computer' || gameMode === 'obstaclesVsComputer' && currentPlayer === WHITE && 'Computer'}
            {gameMode === 'computer' || gameMode === 'obstaclesVsComputer' && currentPlayer === BLACK && 'Human'}
            {gameMode !== 'computer' || gameMode !== 'obstaclesVsComputer' && currentPlayer === BLACK && 'Player 1'}
            {gameMode !== 'computer' || gameMode !== 'obstaclesVsComputer' && currentPlayer === WHITE && 'Player 2'}
          </h2>
          <h2>Current Choice: {currentPlayer === WHITE ? 'White' : 'black'}</h2>
          {gameMode === 'computer' && currentPlayer === WHITE && <h2>Computer is thinking...</h2>}
          {gameMode === 'obstaclesVsComputer' && currentPlayer === WHITE && <h2>Computer is thinking...</h2>}
          <h3>
            Black Pieces: {blackCount} | White Pieces: {whiteCount}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 60px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 60px)`,
              gap: '2px',
              padding: '10px',
              backgroundColor: '#2e8b57',
              borderRadius: '8px',
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex)
                const isFlipped = flippedCells.some(([r, c]) => r === rowIndex && c === colIndex)

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => cell !== 'X' && makeMove(rowIndex, colIndex)}
                    style={{
                      width: '60px',
                      height: '60px',
                      border: '1px solid #444',
                      backgroundColor:
                        cell === BLACK
                          ? 'black'
                          : cell === WHITE
                          ? 'white'
                          : cell === 'X'
                          ? 'gray'
                          : isMove
                          ? 'rgba(0, 255, 0, 0.3)'
                          : 'green',
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                      transition: 'transform 0.5s ease-in-out',
                      perspective: '1000px',
                    }}
                  >
                    {cell && cell !== 'X' && (
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: cell === BLACK ? 'black' : 'white',
                        }}
                      />
                    )}
                    {isMove && (
                      <div
                        style={{
                          position: 'absolute',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 255, 0, 0.5)',
                        }}
                      />
                    )}
                  </div>
                )
              }),
            )}
          </div>
          {isBoardFull() ? (
            <div style={{marginTop: '20px', color: 'red', fontWeight: 'bold'}}>
              Game Over! No more moves left.
              {whiteCount > blackCount ? 'White wins!' : 'Black wins!'}
              {/* styled button */}
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
                <button style={{backgroundColor: 'green', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}} onClick={() => startGame(gameMode)}>Play Again</button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default Board
