/**
 * Contributions API endpoint
 * Fetches GitHub contributions for authenticated user
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchGitHubContributions, getLast365DaysRange } from '@/lib/data/github-api';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('github_access_token')?.value;
  const userCookie = cookieStore.get('github_user')?.value;
  
  // Check authentication
  if (!accessToken || !userCookie) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    const user = JSON.parse(userCookie);
    const { from, to } = getLast365DaysRange();
    
    // Fetch contributions from GitHub
    const contributions = await fetchGitHubContributions(
      accessToken,
      user.login,
      from,
      to
    );
    
    if (!contributions) {
      return NextResponse.json(
        { error: 'Failed to fetch contributions' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      contributions,
      user: {
        username: user.login,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Error in contributions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Sign out endpoint
 */
export async function DELETE() {
  const cookieStore = await cookies();
  
  // Clear auth cookies
  cookieStore.delete('github_access_token');
  cookieStore.delete('github_user');
  
  return NextResponse.json({ success: true });
}
