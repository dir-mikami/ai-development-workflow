'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { COLORS, SHAPES, BOARD_WIDTH, BOARD_HEIGHT } from './constants'
import { GameState, Position, Tetromino } from './types'
import { createEmptyBoard, canMove, mergePiece, clearLines, rotatePiece } from './utils'

export default function TetrisPage() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  // Generate random tetromino
  const generatePiece = useCallback((): Tetromino => {
    const types = Object.keys(SHAPES) as (keyof typeof SHAPES)[]
    const randomType = types[Math.floor(Math.random() * types.length)]
    return {
      type: randomType,
      shape: SHAPES[randomType],
      color: COLORS[randomType]
    }
  }, [])

  // Initialize game
  const initGame = useCallback(() => {
    const first = generatePiece()
    const next = generatePiece()
    setCurrentPiece(first)
    setNextPiece(next)
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })
    setBoard(createEmptyBoard())
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
  }, [generatePiece])

  // Spawn next piece
  const spawnNextPiece = useCallback(() => {
    if (!nextPiece) return

    const newX = Math.floor(BOARD_WIDTH / 2) - 1
    const newY = 0

    if (!canMove(board, nextPiece.shape, { x: newX, y: newY })) {
      setGameOver(true)
      return
    }

    setCurrentPiece(nextPiece)
    setNextPiece(generatePiece())
    setPosition({ x: newX, y: newY })
  }, [board, nextPiece, generatePiece])

  // Move piece down
  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const newY = position.y + 1

    if (canMove(board, currentPiece.shape, { x: position.x, y: newY })) {
      setPosition({ x: position.x, y: newY })
    } else {
      // Lock piece
      const newBoard = mergePiece(board, currentPiece.shape, position, currentPiece.color)
      const { board: clearedBoard, linesCleared } = clearLines(newBoard)

      setBoard(clearedBoard)
      setScore(prev => prev + linesCleared * 100)
      spawnNextPiece()
    }
  }, [currentPiece, position, board, gameOver, isPaused, spawnNextPiece])

  // Move piece left
  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const newX = position.x - 1
    if (canMove(board, currentPiece.shape, { x: newX, y: position.y })) {
      setPosition({ x: newX, y: position.y })
    }
  }, [currentPiece, position, board, gameOver, isPaused])

  // Move piece right
  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const newX = position.x + 1
    if (canMove(board, currentPiece.shape, { x: newX, y: position.y })) {
      setPosition({ x: newX, y: position.y })
    }
  }, [currentPiece, position, board, gameOver, isPaused])

  // Rotate piece
  const rotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const rotated = rotatePiece(currentPiece.shape)
    if (canMove(board, rotated, position)) {
      setCurrentPiece({ ...currentPiece, shape: rotated })
    }
  }, [currentPiece, position, board, gameOver, isPaused])

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    let newY = position.y
    while (canMove(board, currentPiece.shape, { x: position.x, y: newY + 1 })) {
      newY++
    }

    const newBoard = mergePiece(board, currentPiece.shape, { x: position.x, y: newY }, currentPiece.color)
    const { board: clearedBoard, linesCleared } = clearLines(newBoard)

    setBoard(clearedBoard)
    setScore(prev => prev + linesCleared * 100 + (newY - position.y) * 2)
    spawnNextPiece()
  }, [currentPiece, position, board, gameOver, isPaused, spawnNextPiece])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          moveRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          break
        case 'ArrowUp':
          e.preventDefault()
          rotate()
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          setIsPaused(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, gameOver])

  // Game loop
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }

    if (gameOver || isPaused) {
      return
    }

    gameLoopRef.current = setInterval(() => {
      moveDown()
    }, 1000)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [moveDown, gameOver, isPaused])

  // Initialize on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  // Render game board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])

    if (currentPiece && !gameOver) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = position.y + y
            const boardX = position.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        })
      })
    }

    return displayBoard
  }

  const displayBoard = renderBoard()

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main game board */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-6 text-cyan-400">TETRIS</h1>

          <div
            className="bg-gray-800 p-4 rounded-lg shadow-2xl border-2 border-gray-700"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              gap: '1px',
              backgroundColor: '#1f2937'
            }}
          >
            {displayBoard.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="border border-gray-700"
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: cell !== 0 ? `hsl(${cell}, 70%, 50%)` : '#111827',
                    boxShadow: cell !== 0 ? 'inset 0 0 10px rgba(255,255,255,0.2)' : 'none',
                  }}
                />
              ))
            )}
          </div>

          {gameOver && (
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold text-red-500 mb-4">GAME OVER</p>
              <button
                onClick={initGame}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                New Game
              </button>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold text-yellow-500">PAUSED</p>
              <p className="text-sm text-gray-400 mt-2">Press P to resume</p>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-6">
          {/* Score */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700 min-w-[200px]">
            <h2 className="text-xl font-bold mb-2 text-cyan-400">Score</h2>
            <p className="text-3xl font-bold">{score}</p>
          </div>

          {/* Next piece */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700 min-w-[200px]">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Next</h2>
            <div
              className="bg-gray-900 p-4 rounded"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2px',
              }}
            >
              {nextPiece && Array.from({ length: 4 }).map((_, y) =>
                Array.from({ length: 4 }).map((_, x) => {
                  const cell = nextPiece.shape[y]?.[x] || 0
                  return (
                    <div
                      key={`${y}-${x}`}
                      className="border border-gray-700"
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: cell !== 0 ? `hsl(${nextPiece.color}, 70%, 50%)` : '#111827',
                        boxShadow: cell !== 0 ? 'inset 0 0 5px rgba(255,255,255,0.2)' : 'none',
                      }}
                    />
                  )
                })
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Controls</h2>
            <div className="text-sm space-y-2">
              <p><span className="text-cyan-300">←→</span> Move</p>
              <p><span className="text-cyan-300">↓</span> Soft Drop</p>
              <p><span className="text-cyan-300">↑</span> Rotate</p>
              <p><span className="text-cyan-300">Space</span> Hard Drop</p>
              <p><span className="text-cyan-300">P</span> Pause</p>
            </div>
          </div>

          {/* New Game button */}
          {!gameOver && (
            <button
              onClick={initGame}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Restart Game
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
