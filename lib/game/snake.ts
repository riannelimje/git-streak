/**
 * Snake movement and collision logic
 */

import type { Snake, Direction, Position, Grid } from './types';
import { 
  getAdjacentPosition, 
  isOppositeDirection, 
  positionsEqual,
  isInBounds 
} from '../utils/grid-helpers';

/**
 * Create initial snake at given position
 * Snake starts with length 1 (just the head)
 */
export function createSnake(startPosition: Position, direction: Direction = 'RIGHT'): Snake {
  return {
    body: [startPosition],
    direction,
  };
}

/**
 * Get the current head position of the snake
 */
export function getSnakeHead(snake: Snake): Position {
  return snake.body[0];
}

/**
 * Get the current tail position of the snake
 */
export function getSnakeTail(snake: Snake): Position {
  return snake.body[snake.body.length - 1];
}

/**
 * Change snake direction (prevents 180-degree turns)
 */
export function changeDirection(snake: Snake, newDirection: Direction): Snake {
  // Prevent reversing into yourself
  if (snake.body.length > 1 && isOppositeDirection(snake.direction, newDirection)) {
    return snake;
  }
  
  return {
    ...snake,
    direction: newDirection,
  };
}

/**
 * Move snake one step in current direction
 * @param shouldGrow If true, snake grows (tail doesn't move)
 */
export function moveSnake(snake: Snake, shouldGrow: boolean = false): Snake {
  const head = getSnakeHead(snake);
  const newHead = getAdjacentPosition(head, snake.direction);
  
  const newBody = [newHead, ...snake.body];
  
  // If not growing, remove the tail
  if (!shouldGrow) {
    newBody.pop();
  }
  
  return {
    ...snake,
    body: newBody,
  };
}

/**
 * Check if snake collides with itself
 */
export function checkSelfCollision(snake: Snake): boolean {
  const head = getSnakeHead(snake);
  
  // Check if head position matches any body segment (excluding head itself)
  for (let i = 1; i < snake.body.length; i++) {
    if (positionsEqual(head, snake.body[i])) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if snake collides with wall (out of bounds)
 */
export function checkWallCollision(snake: Snake, grid: Grid): boolean {
  const head = getSnakeHead(snake);
  return !isInBounds(head, grid.length);
}

/**
 * Check if snake is at a specific position
 */
export function isSnakeAtPosition(snake: Snake, position: Position): boolean {
  return snake.body.some(segment => positionsEqual(segment, position));
}

/**
 * Get snake length
 */
export function getSnakeLength(snake: Snake): number {
  return snake.body.length;
}

/**
 * Check if a position is occupied by snake body (excluding head)
 * Useful for checking if a position is safe to move to
 */
export function isBodyAtPosition(snake: Snake, position: Position): boolean {
  // Check all segments except the head (index 0)
  for (let i = 1; i < snake.body.length; i++) {
    if (positionsEqual(snake.body[i], position)) {
      return true;
    }
  }
  return false;
}

/**
 * Get the next head position without moving the snake
 */
export function getNextHeadPosition(snake: Snake): Position {
  const head = getSnakeHead(snake);
  return getAdjacentPosition(head, snake.direction);
}

/**
 * Check if the next move would be valid (no collision)
 */
export function isNextMoveValid(snake: Snake, grid: Grid): boolean {
  const nextHead = getNextHeadPosition(snake);
  
  // Check wall collision
  if (!isInBounds(nextHead, grid.length)) {
    return false;
  }
  
  // Check self collision (but not with tail if not growing, as tail will move)
  for (let i = 1; i < snake.body.length - 1; i++) {
    if (positionsEqual(nextHead, snake.body[i])) {
      return false;
    }
  }
  
  return true;
}
