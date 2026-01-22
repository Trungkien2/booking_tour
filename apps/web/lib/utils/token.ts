export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

/**
 * Stores JWT tokens securely in localStorage.
 * Note: For production, consider using HttpOnly cookies via Server Actions.
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }
}

/**
 * Retrieves the access token from localStorage.
 * @returns Access token string or null if not found
 */
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }
  return null;
}

/**
 * Retrieves the refresh token from localStorage.
 * @returns Refresh token string or null if not found
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }
  return null;
}

/**
 * Clears all authentication tokens from localStorage.
 */
export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
}

/**
 * Checks if user has valid tokens stored.
 * @returns true if access token exists, false otherwise
 */
export function hasTokens(): boolean {
  return getAccessToken() !== null;
}
