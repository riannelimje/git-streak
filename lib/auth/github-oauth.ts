/**
 * GitHub OAuth utilities
 */

/**
 * Environment variables for GitHub OAuth
 */
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
export const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || '';
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';

/**
 * GitHub OAuth URLs
 */
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

/**
 * Generate GitHub OAuth authorization URL
 */
export function getGitHubAuthURL(state: string): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'read:user',
    state,
  });
  
  return `${GITHUB_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<string | null> {
  try {
    const response = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to exchange code for token:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}

/**
 * Verify GitHub OAuth configuration
 */
export function isGitHubOAuthConfigured(): boolean {
  return !!(
    GITHUB_CLIENT_ID &&
    GITHUB_CLIENT_SECRET &&
    GITHUB_REDIRECT_URI &&
    NEXTAUTH_SECRET
  );
}

/**
 * Generate random state for CSRF protection
 */
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
