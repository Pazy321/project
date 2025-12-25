import { writable, derived, get } from 'svelte/store';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// State
const user = writable<User | null>(null);
const isLoading = writable(true);
const error = writable<string | null>(null);

// Derived
const isAuthenticated = derived(user, ($user) => $user !== null);
const isAdmin = derived(user, ($user) => $user?.role === 'admin');

// Actions
async function checkAuth(): Promise<User | null> {
  isLoading.set(true);
  error.set(null);
  
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      user.set(data.user);
      return data.user;
    } else {
      user.set(null);
      return null;
    }
  } catch (err) {
    console.error('Auth check failed:', err);
    user.set(null);
    return null;
  } finally {
    isLoading.set(false);
  }
}

async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  isLoading.set(true);
  error.set(null);
  
  console.log('[Auth] Attempting login for:', email);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    
    console.log('[Auth] Login response status:', response.status);
    
    const data = await response.json();
    console.log('[Auth] Login response data:', data);
    
    if (response.ok && data.success) {
      user.set(data.user);
      console.log('[Auth] Login successful, user:', data.user);
      return { success: true };
    } else {
      const errorMessage = data.error || 'Login failed';
      error.set(errorMessage);
      console.log('[Auth] Login failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Network error';
    error.set(errorMessage);
    console.error('[Auth] Login error:', err);
    return { success: false, error: errorMessage };
  } finally {
    isLoading.set(false);
  }
}

async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    user.set(null);
  }
}

function clearError() {
  error.set(null);
}

// Export store
export const authStore = {
  // Stores (subscribable)
  user,
  isLoading,
  error,
  isAuthenticated,
  isAdmin,
  
  // Actions
  checkAuth,
  login,
  logout,
  clearError,
  
  // Helper to get current user
  getUser: () => get(user),
};

