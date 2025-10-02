import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Pet {
  id: number;
  name: string;
  species: string;
  birthDate: string;
  description: string;
  status: "disponivel" | "adotado";
  imageUrl?: string;
  tamanho?: "PEQUENO" | "MEDIO" | "GRANDE";
  personalidade?: string;
}

interface AdoptionRequest {
  id: number;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  adopterAddress: string;
  city: string;
  state: string;
  neighborhood: string;
  number: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  createdAt: string;
  pet: Pet;
}

const AdminAdoptionRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token, user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const { data: requests, isLoading, isError, error } = useQuery<AdoptionRequest[]> ({
    queryKey: ['adoptionRequests'],
    queryFn: async () => {
      if (!token) {
        throw new Error('Token de autenticação não disponível.');
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar solicitações de adoção.');
      }
      return response.json();
    },
    enabled: !!token,
  });

  const updateRequestStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "APPROVED" | "DENIED" }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar status da solicitação.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adoptionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pets'] }); // Invalida cache de pets para atualizar status
      toast({ title: "Sucesso!", description: "O status da solicitação foi atualizado." });
    },
    onError: (err) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div className="text-center">Carregando solicitações...</div>;
  if (isError) return <div className="text-center text-destructive">Erro: {error?.message}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Gerenciamento de Solicitações de Adoção</h1>

        <div className="bg-card p-6 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Adotante</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.adopterName}</TableCell>
                  <TableCell>{req.adopterEmail}</TableCell>
                  <TableCell>{req.adopterPhone}</TableCell>
                  <TableCell>{req.adopterAddress}</TableCell>
                  <TableCell>{req.city}</TableCell>
                  <TableCell>{req.state}</TableCell>
                  <TableCell>{req.neighborhood}</TableCell>
                  <TableCell>{req.number}</TableCell>
                  <TableCell>{req.pet.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={req.status === 'APPROVED' ? 'default' : req.status === 'PENDING' ? 'secondary' : 'destructive'}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {req.status === 'PENDING' && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateRequestStatusMutation.mutate({ id: req.id, status: 'APPROVED' })}
                          disabled={updateRequestStatusMutation.isPending}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateRequestStatusMutation.mutate({ id: req.id, status: 'DENIED' })}
                          disabled={updateRequestStatusMutation.isPending}
                        >
                          Recusar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminAdoptionRequests;
