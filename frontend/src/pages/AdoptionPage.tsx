import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { LoginDialog, RegisterDialog } from '@/components/AuthDialogs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Heart, PawPrint } from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  species: string;
  birthDate: string;
  description: string;
  imageUrl?: string;
  status: "disponivel" | "adotado";
  tamanho?: "PEQUENO" | "MEDIO" | "GRANDE";
  personalidade?: string;
}

const AdoptionPage = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState<'login' | 'register' | null>(null);

  // Fetch pet details
  const { data: pet, isLoading: isPetLoading, isError: isPetError } = useQuery<Pet>({
    queryKey: ['pet', petId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets/${petId}`);
      if (!response.ok) {
        throw new Error('Pet não encontrado.');
      }
      return response.json();
    },
    enabled: !!petId, // Only run query if petId exists
  });

  // State for adopter form
  const [adopterName, setAdopterName] = useState(user?.name || '');
  const [adopterEmail, setAdopterEmail] = useState(user?.email || '');
  const [adopterPhone, setAdopterPhone] = useState('');
  const [adopterAddress, setAdopterAddress] = useState('');

  useEffect(() => {
    if (user) {
      setAdopterName(user.name);
      setAdopterEmail(user.email);
    }
  }, [user]);

  // Mutation for adoption
  const adoptPetMutation = useMutation({
    mutationFn: async (adopterData: { name: string; email: string; phone: string; address: string; petId: number }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adocoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(adopterData),
      });
      if (!response.ok) {
        throw new Error('Falha ao registrar a adoção.');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Sucesso!', description: `Parabéns! Você iniciou o processo de adoção de ${pet?.name}.` });
      navigate('/perfil'); // Redireciona para o perfil após a adoção
    },
    onError: (error) => {
      toast({ title: 'Erro', description: error.message || 'Não foi possível registrar a adoção.', variant: 'destructive' });
    },
  });

  const handleSubmitAdoption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId || !user) {
      toast({ title: 'Erro', description: 'Pet ou usuário não identificado.', variant: 'destructive' });
      return;
    }

    // If not authenticated, we need to register/login first
    if (!isAuthenticated) {
        setDialogOpen('login'); // Or register
        return;
    }

    adoptPetMutation.mutate({ 
        name: adopterName, 
        email: adopterEmail, 
        phone: adopterPhone, 
        address: adopterAddress, 
        petId: parseInt(petId, 10) 
    });
  };

  if (isPetLoading) return <div className="min-h-screen flex items-center justify-center"><p>Carregando pet...</p></div>;
  if (isPetError || !pet) return <div className="min-h-screen flex items-center justify-center"><p>Erro ao carregar pet ou pet não encontrado.</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Adotar {pet.name}</h1>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Detalhes do Pet</CardTitle>
            <CardDescription>Confirme os detalhes do pet que você deseja adotar.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {pet.imageUrl ? (
                <img src={`${import.meta.env.VITE_API_URL}${pet.imageUrl}`} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                  <PawPrint className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">Nome:</span> {pet.name}</p>
              <p><span className="font-semibold">Espécie:</span> {pet.species}</p>
              <p><span className="font-semibold">Descrição:</span> {pet.description}</p>
              {pet.tamanho && <p><span className="font-semibold">Tamanho:</span> {pet.tamanho}</p>}
              {pet.personalidade && <p><span className="font-semibold">Personalidade:</span> {pet.personalidade}</p>}
            </div>
          </CardContent>
        </Card>

        {!isAuthenticated ? (
          <Card className="max-w-3xl mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Faça Login ou Cadastre-se</CardTitle>
              <CardDescription>Para continuar com a adoção, por favor, acesse sua conta ou crie uma nova.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button onClick={() => setDialogOpen('login')}>Login</Button>
              <Button onClick={() => setDialogOpen('register')}>Cadastre-se</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-3xl mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Seus Dados para Adoção</CardTitle>
              <CardDescription>Confirme seus dados para finalizar o processo de adoção.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAdoption} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adopterName">Nome Completo</Label>
                    <Input id="adopterName" value={adopterName} onChange={(e) => setAdopterName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adopterEmail">Email</Label>
                    <Input id="adopterEmail" type="email" value={adopterEmail} onChange={(e) => setAdopterEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adopterPhone">Telefone</Label>
                    <Input id="adopterPhone" value={adopterPhone} onChange={(e) => setAdopterPhone(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adopterAddress">Endereço</Label>
                    <Input id="adopterAddress" value={adopterAddress} onChange={(e) => setAdopterAddress(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={adoptPetMutation.isPending}>
                  {adoptPetMutation.isPending ? 'Finalizando Adoção...' : 'Finalizar Adoção'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
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
    </div>
  );
};

export default AdoptionPage;
