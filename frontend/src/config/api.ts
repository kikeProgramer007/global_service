export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const AUTH_TOKEN_KEY = 'cms_auth_token';

export const getAuthToken = (): string | null =>
  localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
