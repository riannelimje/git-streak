/**
 * GitHub OAuth callback endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForToken } from '@/lib/auth/github-oauth';
import { fetchGitHubUser } from '@/lib/data/github-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }
  
  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/?error=missing_params', request.url)
    );
  }
  
  // Verify state for CSRF protection
  const cookieStore = await cookies();
  const storedState = cookieStore.get('github_oauth_state')?.value;
  
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL('/?error=invalid_state', request.url)
    );
  }
  
  // Exchange code for access token
  const accessToken = await exchangeCodeForToken(code);
  
  if (!accessToken) {
    return NextResponse.redirect(
      new URL('/?error=token_exchange_failed', request.url)
    );
  }
  
  // Fetch user information
  const user = await fetchGitHubUser(accessToken);
  
  if (!user) {
    return NextResponse.redirect(
      new URL('/?error=user_fetch_failed', request.url)
    );
  }
  
  // Store access token and user info in cookies
  cookieStore.set('github_access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  
  cookieStore.set('github_user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  
  // Clear state cookie
  cookieStore.delete('github_oauth_state');
  
  // Redirect back to home with success
  return NextResponse.redirect(new URL('/?auth=success', request.url));
}
