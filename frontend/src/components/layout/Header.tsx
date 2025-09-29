import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User as UserIcon, LogOut } from "lucide-react";
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

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<'login' | 'register' | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { name: "Início", href: "/#home" },
    { name: "Pets", href: "/#pets" },
    { name: "Como Adotar", href: "/#how-to-adopt" },
  ];

  if (isAuthenticated && user?.role === 'ADMIN') {
    navItems.push({ name: "Cadastrar Pet", href: "/#register-pet" });
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AdoteMe
              </span>
            </Link>
            {/* Desktop Navigation */}
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
            
            {/* Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center space-x-2">
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
                    {user?.role === 'ADMIN' && ( // Conditionally render for ADMIN
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
          {/* Mobile Navigation */}
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
