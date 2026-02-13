/**
 * GitHub OAuth initiation endpoint
 */

import { NextResponse } from 'next/server';
import { getGitHubAuthURL, generateState, isGitHubOAuthConfigured } from '@/lib/auth/github-oauth';
import { cookies } from 'next/headers';

export async function GET() {
  // Check if GitHub OAuth is configured
  if (!isGitHubOAuthConfigured()) {
    return NextResponse.json(
      { error: 'GitHub OAuth is not configured' },
      { status: 500 }
    );
  }
  
  // Generate CSRF protection state
  const state = generateState();
  
  // Store state in cookie for verification in callback
  const cookieStore = await cookies();
  cookieStore.set('github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });
  
  // Redirect to GitHub OAuth
  const authURL = getGitHubAuthURL(state);
  return NextResponse.redirect(authURL);
}
