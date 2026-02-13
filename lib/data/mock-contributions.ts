/**
 * Mock contribution datasets for sample gameplay
 */

import { generateLast365Days } from '../utils/date-utils';
import type { ContributionDay, MockDatasetType } from '../game/types';

/**
 * Generate light activity pattern
 * ~30% of days have commits, mostly 1-3 commits
 */
function generateLightActivity(dates: string[]): ContributionDay[] {
  return dates.map(date => {
    const random = Math.random();
    let count = 0;
    
    if (random < 0.3) {
      // 30% chance of activity
      count = Math.floor(Math.random() * 3) + 1; // 1-3 commits
    }
    
    return { date, count };
  });
}

/**
 * Generate medium activity pattern
 * ~60% of days have commits, 1-8 commits, with some streaks
 */
function generateMediumActivity(dates: string[]): ContributionDay[] {
  const contributions: ContributionDay[] = [];
  let streakMode = false;
  let streakLength = 0;
  
  for (const date of dates) {
    let count = 0;
    
    // Random streak generation
    if (!streakMode && Math.random() < 0.1) {
      streakMode = true;
      streakLength = Math.floor(Math.random() * 10) + 5; // 5-14 day streak
    }
    
    if (streakMode) {
      count = Math.floor(Math.random() * 8) + 1; // 1-8 commits
      streakLength--;
      if (streakLength === 0) {
        streakMode = false;
      }
    } else if (Math.random() < 0.6) {
      // 60% chance of activity outside streaks
      count = Math.floor(Math.random() * 5) + 1; // 1-5 commits
    }
    
    contributions.push({ date, count });
  }
  
  return contributions;
}

/**
 * Generate heavy activity pattern
 * ~85% of days have commits, 1-20 commits, with frequent streaks
 */
function generateHeavyActivity(dates: string[]): ContributionDay[] {
  const contributions: ContributionDay[] = [];
  let streakMode = false;
  let streakLength = 0;
  
  for (const date of dates) {
    let count = 0;
    
    // More frequent and longer streaks
    if (!streakMode && Math.random() < 0.2) {
      streakMode = true;
      streakLength = Math.floor(Math.random() * 20) + 10; // 10-29 day streak
    }
    
    if (streakMode) {
      count = Math.floor(Math.random() * 15) + 5; // 5-19 commits
      streakLength--;
      if (streakLength === 0) {
        streakMode = false;
      }
    } else if (Math.random() < 0.85) {
      // 85% chance of activity outside streaks
      count = Math.floor(Math.random() * 10) + 1; // 1-10 commits
    }
    
    contributions.push({ date, count });
  }
  
  return contributions;
}

/**
 * Get mock contribution data by type
 */
export function getMockContributions(type: MockDatasetType): ContributionDay[] {
  const dates = generateLast365Days();
  
  switch (type) {
    case 'light':
      return generateLightActivity(dates);
    case 'medium':
      return generateMediumActivity(dates);
    case 'heavy':
      return generateHeavyActivity(dates);
    default:
      return generateMediumActivity(dates);
  }
}

/**
 * Get all mock dataset options with metadata
 */
export const MOCK_DATASETS = [
  {
    type: 'light' as MockDatasetType,
    label: 'Light Activity',
    description: '~30% active days, easier gameplay',
  },
  {
    type: 'medium' as MockDatasetType,
    label: 'Medium Activity',
    description: '~60% active days, balanced challenge',
  },
  {
    type: 'heavy' as MockDatasetType,
    label: 'Heavy Activity',
    description: '~85% active days, harder gameplay',
  },
];

/**
 * Get total commits for a dataset (for preview/stats)
 */
export function getTotalCommits(contributions: ContributionDay[]): number {
  return contributions.reduce((sum, day) => sum + day.count, 0);
}

/**
 * Get active days count (days with commits > 0)
 */
export function getActiveDaysCount(contributions: ContributionDay[]): number {
  return contributions.filter(day => day.count > 0).length;
}
