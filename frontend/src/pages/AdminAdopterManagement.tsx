import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Adopter {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Componente para listar e gerenciar adotantes
const ListAdopters = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdopter, setEditingAdopter] = useState<Adopter | null>(null);

  const { data: adopters, isLoading, isError, error } = useQuery<Adopter[]>({
    queryKey: ['adopters'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adotantes`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar adotantes.');
      }
      return response.json();
    },
  });

  const deleteAdopterMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adotantes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar adotante.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adopters'] });
      toast({ title: 'Sucesso', description: 'Adotante deletado com sucesso.' });
    },
    onError: (err) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const handleEdit = (adopter: Adopter) => {
    setEditingAdopter(adopter);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este adotante?')) {
      deleteAdopterMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-center">Carregando adotantes...</div>;
  if (isError) return <div className="text-center text-destructive">Erro: {error?.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          setEditingAdopter(null);
          setIsModalOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Adotante
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adopters?.map((adopter) => (
            <TableRow key={adopter.id}>
              <TableCell>{adopter.id}</TableCell>
              <TableCell>{adopter.name}</TableCell>
              <TableCell>{adopter.email}</TableCell>
              <TableCell>{adopter.phone}</TableCell>
              <TableCell>{adopter.address}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(adopter)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(adopter.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RegisterAdopterForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        adopterToEdit={editingAdopter}
      />
    </div>
  );
};

// Componente para adicionar/editar adotantes
const RegisterAdopterForm = ({ isOpen, onClose, adopterToEdit }: {
  isOpen: boolean;
  onClose: () => void;
  adopterToEdit: Adopter | null;
}) => {
  const [formData, setFormData] = useState({
    name: adopterToEdit?.name || '',
    email: adopterToEdit?.email || '',
    phone: adopterToEdit?.phone || '',
    address: adopterToEdit?.address || '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  React.useEffect(() => {
    if (adopterToEdit) {
      setFormData({
        name: adopterToEdit.name,
        email: adopterToEdit.email,
        phone: adopterToEdit.phone,
        address: adopterToEdit.address,
      });
    } else {
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
  }, [adopterToEdit]);

  const createAdopterMutation = useMutation({
    mutationFn: async (newAdopter: Omit<Adopter, 'id'>) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adotantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newAdopter),
      });
      if (!response.ok) {
        throw new Error('Erro ao cadastrar adotante.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adopters'] });
      toast({ title: 'Sucesso', description: 'Adotante cadastrado com sucesso.' });
      onClose();
    },
    onError: (err) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const updateAdopterMutation = useMutation({
    mutationFn: async (updatedAdopter: Adopter) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adotantes/${updatedAdopter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updatedAdopter),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar adotante.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adopters'] });
      toast({ title: 'Sucesso', description: 'Adotante atualizado com sucesso.' });
      onClose();
    },
    onError: (err) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adopterToEdit) {
      updateAdopterMutation.mutate({ ...formData, id: adopterToEdit.id });
    } else {
      createAdopterMutation.mutate(formData);
    }
  };

  const isPending = createAdopterMutation.isPending || updateAdopterMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adopterToEdit ? 'Editar Adotante' : 'Adicionar Novo Adotante'}</DialogTitle>
          <DialogDescription>
            {adopterToEdit ? 'Edite as informações do adotante.' : 'Preencha os campos para adicionar um novo adotante.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required disabled={isPending} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Adotante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminAdopterManagement = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <div className="text-center text-destructive">Acesso negado.</div>; // Ou redirecionar
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Gerenciamento de Adotantes</h1>
        <ListAdopters />
      </main>
    </div>
  );
};

export default AdminAdopterManagement;