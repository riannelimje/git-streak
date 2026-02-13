/**
 * Grid helper utilities
 */

import type { Position } from '../game/types';

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Check if position is within grid bounds
 */
export function isInBounds(pos: Position, gridWeeks: number): boolean {
  return pos.row >= 0 && pos.row < 7 && pos.col >= 0 && pos.col < gridWeeks;
}

/**
 * Get adjacent position based on direction
 */
export function getAdjacentPosition(
  pos: Position,
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
): Position {
  switch (direction) {
    case 'UP':
      return { row: pos.row - 1, col: pos.col };
    case 'DOWN':
      return { row: pos.row + 1, col: pos.col };
    case 'LEFT':
      return { row: pos.row, col: pos.col - 1 };
    case 'RIGHT':
      return { row: pos.row, col: pos.col + 1 };
  }
}

/**
 * Check if moving in opposite direction
 */
export function isOppositeDirection(
  current: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
  next: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
): boolean {
  const opposites: Record<string, string> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[current] === next;
}

/**
 * Calculate Manhattan distance between two positions
 */
export function getManhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}
