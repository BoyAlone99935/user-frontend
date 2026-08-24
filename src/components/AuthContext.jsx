import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  loginWithPassword,
  signupWithPassword,
  loginWithGoogle as loginWithGoogleRequest,
  fetchCurrentUser,
  logoutRequest,
  AuthApiError,
} from "./api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  // Check if the user already has a valid session.
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
      } catch (err) {
        // User is not logged in or session expired.
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setPending(true);
    setError(null);

    try {
      const data = await loginWithPassword({ email, password });
      console.log(data)
      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Couldn't log you in. Please try again."
      );

      throw err;
    } finally {
      setPending(false);
    }
  }, []);

  const signup = useCallback(async ({ username, email, password }) => {
    setPending(true);
    setError(null);

    try {
      const data = await signupWithPassword({
        username,
        email,
        password,
      });

      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Couldn't create your account. Please try again."
      );

      throw err;
    } finally {
      setPending(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    setPending(true);
    setError(null);

    try {
      const data = await loginWithGoogleRequest({ credential });

      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Couldn't sign you in with Google. Please try again."
      );

      throw err;
    } finally {
      setPending(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setPending(true);

    try {
      await logoutRequest();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setPending(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    initializing,
    pending,
    error,
    clearError,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}