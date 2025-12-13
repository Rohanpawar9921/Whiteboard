import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import keycloak from './keycloak';
import type { User } from '@/types';

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
    const initKeycloak = async (): Promise<void> => {
      try {
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
        }

        // Token refresh
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).catch(() => {
            logout();
          });
        };
      } catch (error) {
        console.error('Keycloak init failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = (): void => {
    keycloak.login();
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    keycloak.logout();
  };

  const getToken = (): string | undefined => {
    return keycloak.token;
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
