import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import keycloak from '@/auth/keycloak';
import apiService from '@/services/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMethod: 'keycloak' | 'custom' | null;
  login: () => void;
  logout: () => void;
  customLogin: (email: string, password: string) => Promise<void>;
  customSignup: (username: string, email: string, password: string) => Promise<void>;
  getToken: () => string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authMethod, setAuthMethod] = useState<'keycloak' | 'custom' | null>(null);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      try {
        // Check for custom auth token first
        const customToken = localStorage.getItem('customAuthToken');
        if (customToken) {
          apiService.setAuthToken(customToken);
          try {
            const { user: userData } = await apiService.getCurrentUser();
            setUser({
              id: userData.id,
              username: userData.username,
              email: userData.email,
              token: customToken,
            });
            setIsAuthenticated(true);
            setAuthMethod('custom');
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('Custom token validation failed:', error);
            localStorage.removeItem('customAuthToken');
            apiService.removeAuthToken();
          }
        }

        // Fallback to Keycloak
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });

        setIsAuthenticated(authenticated);

        if (authenticated && keycloak.tokenParsed) {
          setUser({
            id: keycloak.tokenParsed.sub || '',
            username: keycloak.tokenParsed.preferred_username || '',
            email: keycloak.tokenParsed.email || '',
            token: keycloak.token || '',
          });
          setAuthMethod('keycloak');
          apiService.setAuthToken(keycloak.token || '');
        }

        // Token refresh for Keycloak
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).catch(() => {
            logout();
          });
        };
      } catch (error) {
        console.error('Auth init failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (): void => {
    keycloak.login();
  };

  const customLogin = async (email: string, password: string): Promise<void> => {
    try {
      const { user: userData, token } = await apiService.login(email, password);
      localStorage.setItem('customAuthToken', token);
      apiService.setAuthToken(token);
      
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        token,
      });
      setIsAuthenticated(true);
      setAuthMethod('custom');
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const customSignup = async (username: string, email: string, password: string): Promise<void> => {
    try {
      const { user: userData, token } = await apiService.signup(username, email, password);
      localStorage.setItem('customAuthToken', token);
      apiService.setAuthToken(token);
      
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        token,
      });
      setIsAuthenticated(true);
      setAuthMethod('custom');
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (authMethod === 'custom') {
      localStorage.removeItem('customAuthToken');
      apiService.removeAuthToken();
      setAuthMethod(null);
    } else if (authMethod === 'keycloak') {
      keycloak.logout();
    }
  };

  const getToken = (): string | undefined => {
    if (authMethod === 'custom') {
      return localStorage.getItem('customAuthToken') || undefined;
    }
    return keycloak.token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authMethod,
        login,
        logout,
        customLogin,
        customSignup,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
