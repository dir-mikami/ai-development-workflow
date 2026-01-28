// Board dimensions
export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

// Tetromino shapes (using standard SRS rotation system)
export const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
}

// Standard Tetris colors (in HSL hue values for easy manipulation)
export const COLORS = {
  I: 180, // Cyan
  J: 240, // Blue
  L: 30,  // Orange
  O: 60,  // Yellow
  S: 120, // Green
  T: 300, // Purple/Magenta
  Z: 0    // Red
}
