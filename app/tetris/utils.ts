import { BOARD_WIDTH, BOARD_HEIGHT } from './constants'
import { Position } from './types'

// Create empty board
export function createEmptyBoard(): number[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
}

// Check if piece can move to position
export function canMove(
  board: number[][],
  shape: number[][],
  position: Position
): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const newX = position.x + x
        const newY = position.y + y

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false
        }

        // Check collision with existing pieces (ignore if above board)
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false
        }
      }
    }
  }
  return true
}

// Merge piece into board
export function mergePiece(
  board: number[][],
  shape: number[][],
  position: Position,
  color: number
): number[][] {
  const newBoard = board.map(row => [...row])

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const boardY = position.y + y
        const boardX = position.x + x
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = color
        }
      }
    }
  }

  return newBoard
}

// Clear completed lines
export function clearLines(board: number[][]): { board: number[][], linesCleared: number } {
  let linesCleared = 0
  const newBoard = board.filter(row => {
    const isFull = row.every(cell => cell !== 0)
    if (isFull) linesCleared++
    return !isFull
  })

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0))
  }

  return { board: newBoard, linesCleared }
}

// Rotate piece clockwise
export function rotatePiece(shape: number[][]): number[][] {
  const rows = shape.length
  const cols = shape[0].length
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - 1 - y] = shape[y][x]
    }
  }

  return rotated
}
