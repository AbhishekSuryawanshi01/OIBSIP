/**
 * js/auth.js
 * Client-side auth state: token storage, login/logout helpers, route guards
 */

const TOKEN_KEY   = "auth_access_token";
const REFRESH_KEY = "auth_refresh_token";
const USER_KEY    = "auth_user";

const Auth = {
  /** Save tokens and user after login/register */
  save(accessToken, refreshToken, user) {
    localStorage.setItem(TOKEN_KEY,   accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY,    JSON.stringify(user));
  },

  /** Retrieve the current access token */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Retrieve the refresh token */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY);
  },

  /** Retrieve the stored user object */
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },

  /** Returns true if a token exists (basic check — real validation is server-side) */
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /** Clear all stored auth data */
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Guard for protected pages.
   * Call at the top of dashboard.html's script.
   * Redirects to login if not authenticated.
   */
  requireAuth() {
    if (!Auth.isLoggedIn()) {
      window.location.href = "/pages/login.html";
      return false;
    }
    return true;
  },

  /**
   * Guard for auth pages (login/register).
   * Redirects to dashboard if already logged in.
   */
  requireGuest() {
    if (Auth.isLoggedIn()) {
      window.location.href = "/pages/dashboard.html";
      return false;
    }
    return true;
  },

  /** Full logout: clear state + redirect */
  logout() {
    Auth.clear();
    window.location.href = "/pages/login.html";
  },
};

window.Auth = Auth;
