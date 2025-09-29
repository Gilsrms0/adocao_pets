import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define a interface para os dados do usuário
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Define a interface para o contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Cria o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define o provedor de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) {
      try {
        // Decodifica o token para extrair informações do usuário
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
