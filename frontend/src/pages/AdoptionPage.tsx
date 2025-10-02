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
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (user) {
      setAdopterName(user.name);
      setAdopterEmail(user.email);
      // Se o user.address for um objeto com city, state, etc., preencher aqui
      // Por enquanto, assumimos que é uma string e os campos detalhados serão preenchidos manualmente
    }
  }, [user]);

  // Mutation for adoption (CORRIGIDA)
  const adoptPetMutation = useMutation({
    mutationFn: async (adopterData: { 
      adopterName: string; 
      adopterEmail: string; 
      adopterPhone: string; 
      adopterAddress: string; 
      city: string; 
      state: string; 
      neighborhood: string; 
      number: string; 
      petId: number; 
    }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // A rota agora é protegida, então o token é necessário
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(adopterData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao registrar a solicitação de adoção.');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Sucesso!', description: `Parabéns! Sua solicitação de adoção para ${pet?.name} foi enviada e está aguardando aprovação.` });
      navigate('/perfil'); // Redireciona para o perfil após a solicitação
    },
    onError: (error) => {
      console.error("Adoption mutation error:", error); // Adicionado para depuração
      toast({ title: 'Erro', description: error.message || 'Não foi possível registrar a solicitação de adoção.', variant: 'destructive' });
    },
  });

  const handleSubmitAdoption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) {
      toast({ title: 'Erro', description: 'Pet não identificado.', variant: 'destructive' });
      return;
    }

    if (!isAuthenticated) {
        setDialogOpen('login');
        return;
    }

    if (!adopterName || !adopterEmail || !adopterPhone || !adopterAddress || !city || !state || !neighborhood || !number) {
      toast({ title: 'Erro', description: 'Por favor, preencha todos os campos obrigatórios do formulário.', variant: 'destructive' });
      return;
    }

    // O `adotanteId` foi removido, o backend vai identificá-lo pelo token
    adoptPetMutation.mutate({ 
        adopterName, 
        adopterEmail, 
        adopterPhone, 
        adopterAddress, 
        city, 
        state, 
        neighborhood, 
        number, 
        petId: parseInt(petId, 10), 
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
              <CardTitle className="text-2xl">Seus Dados para Solicitação de Adoção</CardTitle>
              <CardDescription>Preencha seus dados para enviar a solicitação de adoção.</CardDescription>
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
                    <Label htmlFor="adopterAddress">Endereço (Rua, Avenida, etc.)</Label>
                    <Input id="adopterAddress" value={adopterAddress} onChange={(e) => setAdopterAddress(e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={adoptPetMutation.isPending}>
                  {adoptPetMutation.isPending ? 'Enviando Solicitação...' : 'Enviar Solicitação de Adoção'}
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
