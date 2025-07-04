import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      try {
        // For demo purposes, we'll simulate a logged-in user
        const mockUser = {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // Simulate login
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: credentials.email
      };
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}