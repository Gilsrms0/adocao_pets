import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Tipos
interface Pet {
  id: number;
  name: string;
}

interface AdoptionRequest {
  id: number;
  adopterName: string;
  adopterEmail: string;
  status: string;
  createdAt: string;
  pet: Pet;
}

const AdminAdoptionRequests = () => {
  const { user, isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchAdoptionRequests = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar solicitações.');
    return response.json();
  };

  const { data: requests, isLoading, isError } = useQuery<AdoptionRequest[]>({ 
    queryKey: ['adoptionRequests'], 
    queryFn: fetchAdoptionRequests 
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error(`Falha ao ${status === 'APPROVED' ? 'aprovar' : 'recusar'} a solicitação.`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "O status da solicitação foi atualizado." });
      queryClient.invalidateQueries({ queryKey: ['adoptionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const handleUpdateRequest = (id: number, status: 'APPROVED' | 'DENIED') => {
    updateRequestMutation.mutate({ id, status });
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const pendingRequests = requests?.filter(r => r.status === 'PENDING') || [];
  const processedRequests = requests?.filter(r => r.status !== 'PENDING') || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Gerenciar Solicitações de Adoção</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Carregando...</p>}
            {isError && <p className="text-destructive">Erro ao carregar.</p>}
            <div className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map(req => (
                  <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card">
                    <div>
                      <p className="font-semibold">{req.adopterName} <span className="text-sm text-muted-foreground">({req.adopterEmail})</span></p>
                      <p className="text-sm">Deseja adotar: <span className="font-medium">{req.pet.name}</span></p>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleUpdateRequest(req.id, 'APPROVED')} disabled={updateRequestMutation.isPending}>
                        <Check className="h-4 w-4 mr-2" /> Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleUpdateRequest(req.id, 'DENIED')} disabled={updateRequestMutation.isPending}>
                        <X className="h-4 w-4 mr-2" /> Recusar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma solicitação pendente.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solicitações Processadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedRequests.length > 0 ? (
                processedRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-lg border bg-card-muted">
                    <div>
                      <p className="font-semibold">{req.adopterName}</p>
                      <p className="text-sm">Pet: <span className="font-medium">{req.pet.name}</span></p>
                    </div>
                    <Badge variant={req.status === 'APPROVED' ? 'default' : 'destructive'}>{req.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma solicitação processada.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default AdminAdoptionRequests;
