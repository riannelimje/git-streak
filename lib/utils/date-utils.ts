/**
 * Date utilities for generating 365-day grids
 */

/**
 * Get the date 365 days ago from today
 */
export function getOneYearAgo(): Date {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(today.getDate() - 365);
  return oneYearAgo;
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get date for a specific day offset from start date
 */
export function getDateOffset(startDate: Date, offsetDays: number): Date {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + offsetDays);
  return date;
}

/**
 * Generate array of dates for the last 365 days
 * Returns array of ISO date strings in chronological order
 */
export function generateLast365Days(): string[] {
  const dates: string[] = [];
  const startDate = getOneYearAgo();
  
  for (let i = 0; i < 365; i++) {
    const date = getDateOffset(startDate, i);
    dates.push(formatDate(date));
  }
  
  return dates;
}

/**
 * Get the day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(dateString: string): number {
  return new Date(dateString).getDay();
}

/**
 * Parse ISO date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Get week number (0-52) from start of the 365-day period
 */
export function getWeekNumber(dateString: string, startDate: Date): number {
  const current = parseDate(dateString);
  const diffTime = current.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

/**
 * Get a human-readable date string (e.g., "Jan 15, 2026")
 */
export function formatDisplayDate(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}
