import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister?: () => void;
  onSwitchToLogin?: () => void;
}

export const LoginDialog = ({ open, onOpenChange, onSwitchToRegister }: AuthDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login.'); // Corrigido para data.error
      }

      login(data.token);
      toast({ title: 'Sucesso!', description: 'Login realizado com sucesso.' });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Acesse sua conta para ver seus pets favoritos e histórico de adoção.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email-login" className="text-right">Email</Label>
            <Input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password-login" className="text-right">Senha</Label>
            <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
          </div>
          {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={onSwitchToRegister}>Não tem uma conta? Cadastre-se</Button>
            <Button type="submit" onClick={handleLogin} disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const RegisterDialog = ({ open, onOpenChange, onSwitchToLogin }: AuthDialogProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
  
    const handleRegister = async () => {
      setIsSubmitting(true);
      setError('');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: 'ADOTANTE' }), // Default role
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'Falha no registro.'); // Corrigido para data.error
        }
  
        login(data.token);
        toast({ title: 'Sucesso!', description: 'Registro e login realizados com sucesso.' });
        onOpenChange(false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastro</DialogTitle>
            <DialogDescription>
              Crie sua conta para uma experiência completa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name-register" className="text-right">Nome</Label>
              <Input id="name-register" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-register" className="text-right">Email</Label>
              <Input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password-register" className="text-right">Senha</Label>
              <Input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
            </div>
            {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between">
              <Button variant="ghost" onClick={onSwitchToLogin}>Já tem uma conta? Faça login</Button>
              <Button type="submit" onClick={handleRegister} disabled={isSubmitting}>
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
