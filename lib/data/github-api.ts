/**
 * GitHub GraphQL API client
 */

import type { ContributionDay } from '../game/types';

/**
 * GitHub GraphQL API endpoint
 */
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

/**
 * GraphQL query to fetch user contribution calendar
 */
const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch authenticated user info
 */
const USER_INFO_QUERY = `
  query {
    viewer {
      login
      avatarUrl
      name
    }
  }
`;

/**
 * GitHub API response types
 */
interface GitHubContributionDay {
  date: string;
  contributionCount: number;
}

interface GitHubWeek {
  contributionDays: GitHubContributionDay[];
}

interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: GitHubWeek[];
}

interface GitHubUserInfo {
  login: string;
  avatarUrl: string;
  name: string | null;
}

/**
 * Fetch user information from GitHub
 */
export async function fetchGitHubUser(accessToken: string): Promise<GitHubUserInfo | null> {
  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: USER_INFO_QUERY }),
    });
    
    if (!response.ok) {
      console.error('Failed to fetch user info:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('GitHub API errors:', data.errors);
      return null;
    }
    
    return data.data?.viewer || null;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

/**
 * Fetch contribution calendar from GitHub GraphQL API
 */
export async function fetchGitHubContributions(
  accessToken: string,
  username: string,
  from: string,
  to: string
): Promise<ContributionDay[] | null> {
  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username, from, to },
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to fetch contributions:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('GitHub API errors:', data.errors);
      return null;
    }
    
    const calendar: GitHubContributionCalendar =
      data.data?.user?.contributionsCollection?.contributionCalendar;
    
    if (!calendar) {
      console.error('No contribution calendar found');
      return null;
    }
    
    // Flatten weeks into a single array of contribution days
    const contributions: ContributionDay[] = [];
    
    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
        });
      }
    }
    
    // Sort by date to ensure correct order
    contributions.sort((a, b) => a.date.localeCompare(b.date));
    
    // Take last 365 days
    return contributions.slice(-365);
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return null;
  }
}

/**
 * Get date range for last 365 days (for GraphQL query)
 */
export function getLast365DaysRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 365);
  
  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}
