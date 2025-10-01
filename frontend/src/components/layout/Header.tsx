import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User as UserIcon, LogOut, PawPrint } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog, RegisterDialog } from "@/components/AuthDialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<'login' | 'register' | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { name: "Início", href: "/#home" },
    { name: "Aumigos", href: "/#pets" },
    { name: "Como Adotar", href: "/#how-to-adopt" },
  ];

  

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              {/* Símbolo */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Coração (fundo) com gradiente */}
                <div className="absolute inset-0 bg-gradient-primary rounded-full"></div>
                {/* Ícone de pata por cima */}
                <PawPrint className="relative w-6 h-6 text-white" />
              </div>
              {/* Texto */}
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AdoteMe
              </span>
            </Link>
            {/* Navegação para Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            
            {/* Botões de Autenticação / Menu do Usuário */}
            <div className="hidden md:flex items-center space-x-4">
              <ModeToggle />
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <UserIcon className="w-4 h-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user?.role === 'ADMIN' && ( // Renderização condicional para ADMIN
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Dashboard Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/perfil">Meu Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setDialogOpen('login')}>Login</Button>
                  <Button onClick={() => setDialogOpen('register')} className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    Cadastrar
                  </Button>
                </>
              )}
            </div>

            {/* Botão do Menu Móvel */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
          {/* Navegação Móvel */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 border-t mt-4">
                  {isAuthenticated && user ? (
                     <div className="flex flex-col space-y-2">
                        <Link to="/perfil" className="px-2 py-2 rounded-md text-foreground font-medium hover:bg-muted" onClick={() => setIsMenuOpen(false)}>Meu Perfil</Link>
                        <Button variant="ghost" onClick={() => { logout(); setIsMenuOpen(false); }}>Sair</Button>
                     </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" onClick={() => { setDialogOpen('login'); setIsMenuOpen(false); }}>Login</Button>
                      <Button onClick={() => { setDialogOpen('register'); setIsMenuOpen(false); }} className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                        Cadastrar
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <LoginDialog 
        open={dialogOpen === 'login'} 
        onOpenChange={(open) => !open && setDialogOpen(null)}
        onSwitchToRegister={() => setDialogOpen('register')}
      />
      <RegisterDialog 
        open={dialogOpen === 'register'} 
        onOpenChange={(open) => !open && setDialogOpen(null)}
        onSwitchToLogin={() => setDialogOpen('login')}
      />
    </>
  );
};