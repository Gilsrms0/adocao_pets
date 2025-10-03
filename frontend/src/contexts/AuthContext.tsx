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
  isLoading: boolean; // Adicionado para rastrear o estado de carregamento
  login: (token: string) => void;
  logout: () => void;
}

// Cria o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define o provedor de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true); // Inicia como true

  useEffect(() => {
    const verifyToken = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          // Decodifica o token para extrair informações do usuário
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          // Verifica se o token expirou (opcional, mas recomendado)
          if (payload.exp * 1000 < Date.now()) {
            throw new Error("Token expirado.");
          }
          setUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
          setToken(storedToken);
        } catch (error) {
          console.error("Falha ao verificar o token:", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setIsLoading(false); // Finaliza o carregamento
    };

    verifyToken();
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
    } catch (error) {
      console.error("Falha ao decodificar o novo token:", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    isAuthenticated: !isLoading && !!token,
    user,
    token,
    isLoading,
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
