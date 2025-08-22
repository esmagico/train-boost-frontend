import { decodeJWT } from './jwt';

export const refreshAccessToken = async () => {
  try {
    const tokens = JSON.parse(localStorage.getItem("trainboost_tokens") || '{}');
    
    if (!tokens.refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://xstk67r5-3001.inc1.devtunnels.ms/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Store new tokens
      localStorage.setItem("trainboost_tokens", JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      }));
      
      return data.access_token;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    // Clear tokens and redirect to login
    localStorage.removeItem("trainboost_tokens");
    window.location.href = '/login';
    throw error;
  }
};

export const getValidAccessToken = async () => {
  const tokens = JSON.parse(localStorage.getItem("trainboost_tokens") || '{}');
  
  if (!tokens.access_token) {
    return null;
  }

  const decoded = decodeJWT(tokens.access_token);
  
  // Check if token is expired (with 30 second buffer)
  if (decoded && decoded.exp > (Date.now() / 1000) + 30) {
    return tokens.access_token;
  }
  
  // Token is expired, try to refresh
  return await refreshAccessToken();
};