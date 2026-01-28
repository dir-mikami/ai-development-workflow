export interface Position {
  x: number
  y: number
}

export interface Tetromino {
  type: string
  shape: number[][]
  color: number
}

export interface GameState {
  board: number[][]
  currentPiece: Tetromino | null
  nextPiece: Tetromino | null
  position: Position
  score: number
  gameOver: boolean
}
