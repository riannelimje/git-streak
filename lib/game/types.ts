/**
 * Core game types for git-streak
 */

/**
 * Represents a single day in the contribution grid
 */
export type Tile = {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Number of commits on this day */
  commits: number;
  /** Whether the snake has collected this tile */
  isCollected: boolean;
};

/**
 * 2D grid representing the contribution calendar
 * Organized as weeks (columns) × days (rows)
 * Grid[week][day]
 */
export type Grid = Tile[][];

/**
 * Direction the snake can move
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Position on the grid
 */
export type Position = {
  row: number;
  col: number;
};

/**
 * Snake state
 */
export type Snake = {
  /** Array of positions, head is at index 0 */
  body: Position[];
  /** Current direction of movement */
  direction: Direction;
};

/**
 * Overall game state
 */
export type GameState = {
  grid: Grid;
  snake: Snake;
  score: number;
  isGameOver: boolean;
  isWin: boolean;
  tilesCollectedSinceGrowth: number; // Track tiles collected to grow every 5
};

/**
 * Game mode
 */
export type GameMode = 'mock' | 'github';

/**
 * Player info (for GitHub mode)
 */
export type Player = {
  username: string;
  avatarUrl: string;
} | null;

/**
 * Contribution data intensity levels for visualization
 */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Raw contribution data from API or mock
 */
export type ContributionDay = {
  date: string;
  count: number;
};

/**
 * Mock dataset types
 */
export type MockDatasetType = 'light' | 'medium' | 'heavy';
