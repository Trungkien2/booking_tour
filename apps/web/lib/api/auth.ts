import { LoginFormData, SocialLoginData } from '@/lib/validations/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Authenticates user with email and password.
 * @param data - Login credentials (email and password)
 * @returns LoginResponse with tokens and user info
 * @throws Error if login fails (invalid credentials, network error, etc.)
 */
export async function login(data: LoginFormData): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies if using HttpOnly cookies
    });

    if (!response.ok) {
      // Try to parse error response
      let errorMessage = 'Login failed. Please try again.';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.status === 401
          ? 'Invalid email or password'
          : response.status === 429
          ? 'Too many login attempts. Please try again later.'
          : `Login failed: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const result: LoginResponse = await response.json();
    return result;
  } catch (error) {
    // Re-throw if it's already an Error with message
    if (error instanceof Error) {
      throw error;
    }
    // Handle network errors
    throw new Error('Network error. Please check your connection and try again.');
  }
}

export async function socialLogin(data: SocialLoginData): Promise<LoginResponse> {
  // TODO: Implement social login API call
  const endpoint = data.provider === 'google' ? '/auth/google' : '/auth/apple';
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken: data.idToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Social login failed');
  }

  return response.json();
}
