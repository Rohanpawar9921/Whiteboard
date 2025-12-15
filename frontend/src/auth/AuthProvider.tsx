import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import keycloak from './keycloak';
import type { User } from '@/types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
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

export const AuthProvider = ({ children }: AuthProviderProps): React.JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const initKeycloak = async (): Promise<void> => {
      try {
        // Check if already initialized by checking if adapter exists
        // @ts-expect-error - accessing private field for initialization check
        if (keycloak.adapter) {
          console.log('Keycloak already initialized');
          if (mounted) {
            setIsAuthenticated(keycloak.authenticated || false);
            if (keycloak.authenticated && keycloak.tokenParsed) {
              const userData: User = {
                id: keycloak.tokenParsed.sub || '',
                username: keycloak.tokenParsed.preferred_username || '',
                email: keycloak.tokenParsed.email || '',
                token: keycloak.token || '',
              };
              setUser(userData);
              
              // Set the auth token in the API service
              if (keycloak.token) {
                apiService.setAuthToken(keycloak.token);
              }
            }
            setIsLoading(false);
          }
          return;
        }

        console.log('Initializing Keycloak...');

        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });

        console.log('Keycloak initialized, authenticated:', authenticated);

        if (mounted) {
          setIsAuthenticated(authenticated);

          if (authenticated && keycloak.tokenParsed) {
            const userData: User = {
              id: keycloak.tokenParsed.sub || '',
              username: keycloak.tokenParsed.preferred_username || '',
              email: keycloak.tokenParsed.email || '',
              token: keycloak.token || '',
            };
            setUser(userData);
            
            // Set the auth token in the API service
            if (keycloak.token) {
              apiService.setAuthToken(keycloak.token);
            }
          }

          // Token refresh
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(30).then((refreshed) => {
              if (refreshed && keycloak.token) {
                console.log('Token refreshed');
                apiService.setAuthToken(keycloak.token);
              }
            }).catch(() => {
              logout();
            });
          };

          setIsLoading(false);
        }
      } catch (error) {
        console.error('Keycloak init failed:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initKeycloak();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (): void => {
    keycloak.login();
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    apiService.removeAuthToken(); // Remove token from API service
    if (keycloak && keycloak.logout) {
      keycloak.logout();
    }
  };

  const getToken = (): string | undefined => {
    return keycloak?.token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
