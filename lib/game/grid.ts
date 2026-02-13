/**
 * Grid generation and manipulation logic
 */

import type { Grid, Tile, ContributionDay, ContributionLevel } from './types';
import { getDayOfWeek, getWeekNumber, getOneYearAgo } from '../utils/date-utils';

/**
 * Convert contribution count to visual level (0-4)
 * Based on GitHub's contribution graph levels
 */
export function getContributionLevel(count: number): ContributionLevel {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Get CSS color for contribution level
 * Matches GitHub's green color scale
 */
export function getLevelColor(level: ContributionLevel): string {
  const colors = {
    0: '#161b22', // Dark grey (no contributions)
    1: '#0e4429', // Light green
    2: '#006d32', // Medium green
    3: '#26a641', // Bright green
    4: '#39d353', // Brightest green
  };
  return colors[level];
}

/**
 * Transform contribution data into a 2D grid
 * Grid is organized as weeks (columns) × days (rows)
 * Each week has 7 days (Sunday to Saturday)
 * 
 * @param contributions Array of contribution days
 * @returns Grid organized as Grid[week][day]
 */
export function createGrid(contributions: ContributionDay[]): Grid {
  const startDate = getOneYearAgo();
  const grid: Grid = [];
  
  // Initialize grid structure
  // We need up to 53 weeks to cover 365 days
  for (let week = 0; week < 53; week++) {
    grid[week] = [];
    for (let day = 0; day < 7; day++) {
      grid[week][day] = {
        date: '',
        commits: 0,
        isCollected: false,
      };
    }
  }
  
  // Populate grid with contribution data
  contributions.forEach(contribution => {
    const dayOfWeek = getDayOfWeek(contribution.date);
    const weekNumber = getWeekNumber(contribution.date, startDate);
    
    // Only add if within valid grid bounds
    if (weekNumber >= 0 && weekNumber < 53) {
      grid[weekNumber][dayOfWeek] = {
        date: contribution.date,
        commits: contribution.count,
        isCollected: false,
      };
    }
  });
  
  return grid;
}

/**
 * Get a tile from the grid at specific position
 */
export function getTile(grid: Grid, row: number, col: number): Tile | null {
  if (row < 0 || row >= 7 || col < 0 || col >= grid.length) {
    return null;
  }
  return grid[col][row];
}

/**
 * Update a tile in the grid (returns new grid, immutable)
 */
export function updateTile(
  grid: Grid,
  row: number,
  col: number,
  updates: Partial<Tile>
): Grid {
  return grid.map((week, weekIndex) =>
    weekIndex === col
      ? week.map((tile, dayIndex) =>
          dayIndex === row ? { ...tile, ...updates } : tile
        )
      : week
  );
}

/**
 * Check if a tile is collectable (has commits and not yet collected)
 */
export function isCollectable(tile: Tile): boolean {
  return tile.commits > 0 && !tile.isCollected;
}

/**
 * Get total number of collectable tiles in the grid
 */
export function getCollectableCount(grid: Grid): number {
  let count = 0;
  for (const week of grid) {
    for (const tile of week) {
      if (isCollectable(tile)) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Get total possible score (sum of all commits)
 */
export function getMaxScore(grid: Grid): number {
  let total = 0;
  for (const week of grid) {
    for (const tile of week) {
      total += tile.commits;
    }
  }
  return total;
}

/**
 * Check if all collectable tiles have been collected
 */
export function areAllTilesCollected(grid: Grid): boolean {
  return getCollectableCount(grid) === 0;
}

/**
 * Get grid dimensions
 */
export function getGridDimensions(grid: Grid): { weeks: number; days: number } {
  return {
    weeks: grid.length,
    days: grid.length > 0 ? grid[0].length : 0,
  };
}

/**
 * Find the first collectable tile (useful for initial snake position)
 */
export function findFirstCollectableTile(grid: Grid): { row: number; col: number } | null {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      if (isCollectable(grid[col][row])) {
        return { row, col };
      }
    }
  }
  return null;
}
