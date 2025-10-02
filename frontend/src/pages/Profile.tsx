import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from "@/components/layout/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Interface para a adoção, incluindo o pet
interface Adocao {
  id: number;
  dataAdocao: string;
  pet: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

// Interface para o pedido de adoção
interface AdoptionRequest {
  id: number;
  status: string;
  createdAt: string;
  pet: {
    id: number;
    name: string;
  };
}

const ProfilePage = () => {
  const { user, isAuthenticated, logout, token } = useAuth();

  // Hook para buscar o histórico de adoções
  const { data: adocoes, isLoading: isLoadingAdocoes, isError: isErrorAdocoes } = useQuery<Adocao[]>({ 
    queryKey: ['minhasAdocoes', user?.id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adocoes/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar o histórico de adoções.');
      }
      return response.json();
    },
    enabled: !!token,
  });

  // Hook para buscar os pedidos de adoção
  const { data: adoptionRequests, isLoading: isLoadingRequests, isError: isErrorRequests } = useQuery<AdoptionRequest[]>({ 
    queryKey: ['meusPedidosDeAdocao', user?.id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adotantes/me/adoption-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar os pedidos de adoção.');
      }
      return response.json();
    },
    enabled: !!token,
  });

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'DENIED':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-12">
            {/* Seção Meus Pedidos de Adoção */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Meus Pedidos de Adoção</h3>
              {isLoadingRequests && <p className="text-center text-muted-foreground">Carregando seus pedidos...</p>}
              {isErrorRequests && <p className="text-center text-destructive">Ocorreu um erro ao buscar seus pedidos.</p>}
              {adoptionRequests && adoptionRequests.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pet</TableHead>
                      <TableHead>Data do Pedido</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adoptionRequests.map(request => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.pet.name}</TableCell>
                        <TableCell>{format(new Date(request.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {adoptionRequests && adoptionRequests.length === 0 && (
                <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                  <p>Você ainda não fez nenhum pedido de adoção.</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/">Ver pets disponíveis</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Seção Minhas Adoções */}
            <div>
                <h3 className="text-xl font-semibold mb-6 text-center">Minhas Adoções</h3>
                {isLoadingAdocoes && <p className="text-center text-muted-foreground">Carregando seu histórico...</p>}
                {isErrorAdocoes && <p className="text-center text-destructive">Ocorreu um erro ao buscar seu histórico.</p>}
                {adocoes && adocoes.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adocoes.map(adocao => (
                      <Card key={adocao.id}>
                        <CardHeader className="p-0">
                          <img src={`${import.meta.env.VITE_API_URL}${adocao.pet.imageUrl}`} alt={adocao.pet.name} className="aspect-square w-full rounded-t-lg object-cover" />
                        </CardHeader>
                        <CardContent className="text-center p-4">
                          <p className="font-bold text-lg">{adocao.pet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Adotado em {format(new Date(adocao.dataAdocao), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                 {adocoes && adocoes.length === 0 && (
                    <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                        <p>Você ainda não adotou nenhum pet.</p>
                        <Button asChild variant="link" className="mt-2">
                            <Link to="/">Ver pets disponíveis</Link>
                        </Button>
                    </div>
                 )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;