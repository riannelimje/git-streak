/**
 * Core game engine logic
 * Handles game state management, game loop, and win/loss conditions
 */

import type { GameState, Direction, Grid, Snake, Position } from './types';
import { 
  createSnake, 
  moveSnake, 
  changeDirection, 
  checkSelfCollision, 
  checkWallCollision,
  getSnakeHead,
  isNextMoveValid
} from './snake';
import { 
  getTile, 
  updateTile, 
  isCollectable, 
  areAllTilesCollected,
  findFirstCollectableTile 
} from './grid';

/**
 * Initialize a new game state
 */
export function initializeGame(grid: Grid): GameState {
  // Find the first collectable tile to start the snake
  const startPos = findFirstCollectableTile(grid);
  
  if (!startPos) {
    // If no collectable tiles, start at 0,0
    return {
      grid,
      snake: createSnake({ row: 0, col: 0 }, 'RIGHT'),
      score: 0,
      isGameOver: true,
      isWin: false,
    };
  }
  
  return {
    grid,
    snake: createSnake(startPos, 'RIGHT'),
    score: 0,
    isGameOver: false,
    isWin: false,
  };
}

/**
 * Handle direction change input
 */
export function handleDirectionChange(
  gameState: GameState,
  newDirection: Direction
): GameState {
  if (gameState.isGameOver) {
    return gameState;
  }
  
  return {
    ...gameState,
    snake: changeDirection(gameState.snake, newDirection),
  };
}

/**
 * Check if tile at position is collectable
 */
function isTileCollectable(grid: Grid, position: Position): boolean {
  const tile = getTile(grid, position.row, position.col);
  return tile ? isCollectable(tile) : false;
}

/**
 * Collect tile at snake's head position
 */
function collectTile(grid: Grid, position: Position): { grid: Grid; points: number } {
  const tile = getTile(grid, position.row, position.col);
  
  if (!tile || !isCollectable(tile)) {
    return { grid, points: 0 };
  }
  
  const updatedGrid = updateTile(grid, position.row, position.col, {
    isCollected: true,
  });
  
  return {
    grid: updatedGrid,
    points: tile.commits,
  };
}

/**
 * Process one game tick (move snake forward)
 * This is the main game loop function
 */
export function tick(gameState: GameState): GameState {
  if (gameState.isGameOver) {
    return gameState;
  }
  
  const { snake, grid, score } = gameState;
  
  // Check if next move is valid before moving
  if (!isNextMoveValid(snake, grid)) {
    return {
      ...gameState,
      isGameOver: true,
      isWin: false,
    };
  }
  
  // Move the snake first
  const movedSnake = moveSnake(snake, false); // Never grow automatically
  const newHead = getSnakeHead(movedSnake);
  
  // Check for collisions after moving
  if (checkWallCollision(movedSnake, grid) || checkSelfCollision(movedSnake)) {
    return {
      ...gameState,
      snake: movedSnake,
      isGameOver: true,
      isWin: false,
    };
  }
  
  // Collect tiles for all positions the snake occupies
  let updatedGrid = grid;
  let totalPoints = 0;
  
  for (const position of movedSnake.body) {
    const { grid: newGrid, points } = collectTile(updatedGrid, position);
    updatedGrid = newGrid;
    totalPoints += points;
  }
  
  const newScore = score + totalPoints;
  
  // Check win condition (all tiles collected)
  const hasWon = areAllTilesCollected(updatedGrid);
  
  return {
    grid: updatedGrid,
    snake: movedSnake,
    score: newScore,
    isGameOver: hasWon,
    isWin: hasWon,
  };
}

/**
 * Restart game with the same grid
 */
export function restartGame(currentState: GameState): GameState {
  // Reset all tiles to not collected
  const resetGrid = currentState.grid.map(week =>
    week.map(tile => ({
      ...tile,
      isCollected: false,
    }))
  );
  
  return initializeGame(resetGrid);
}

/**
 * Start a new game with a fresh grid
 */
export function startNewGame(grid: Grid): GameState {
  return initializeGame(grid);
}

/**
 * Check if game is in playing state
 */
export function isGamePlaying(gameState: GameState): boolean {
  return !gameState.isGameOver;
}

/**
 * Get game statistics
 */
export function getGameStats(gameState: GameState): {
  score: number;
  tilesCollected: number;
  tilesRemaining: number;
  snakeLength: number;
} {
  let tilesCollected = 0;
  let tilesRemaining = 0;
  
  for (const week of gameState.grid) {
    for (const tile of week) {
      if (tile.commits > 0) {
        if (tile.isCollected) {
          tilesCollected++;
        } else {
          tilesRemaining++;
        }
      }
    }
  }
  
  return {
    score: gameState.score,
    tilesCollected,
    tilesRemaining,
    snakeLength: gameState.snake.body.length,
  };
}

/**
 * Game action types for state management
 */
export type GameAction =
  | { type: 'TICK' }
  | { type: 'CHANGE_DIRECTION'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'NEW_GAME'; grid: Grid };

/**
 * Game state reducer for React integration
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK':
      return tick(state);
    
    case 'CHANGE_DIRECTION':
      return handleDirectionChange(state, action.direction);
    
    case 'RESTART':
      return restartGame(state);
    
    case 'NEW_GAME':
      return startNewGame(action.grid);
    
    default:
      return state;
  }
}
