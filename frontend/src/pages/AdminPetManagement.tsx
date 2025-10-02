import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, PlusCircle, PawPrint } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Navigate } from "react-router-dom";

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

// Componente para adicionar/editar pets
const RegisterPetForm = ({ isOpen, onClose, petToEdit }: {
  isOpen: boolean;
  onClose: () => void;
  petToEdit: Pet | null;
}) => {
  const [formData, setFormData] = useState({
    name: petToEdit?.name || "",
    species: petToEdit?.species || "",
    birthDate: petToEdit?.birthDate.split('T')[0] || "", // Formata para input type="date"
    description: petToEdit?.description || "",
    tamanho: petToEdit?.tamanho || "",
    personalidade: petToEdit?.personalidade || "",
    status: petToEdit?.status || "disponivel",
    image: null as File | null,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  React.useEffect(() => {
    if (petToEdit) {
      setFormData({
        name: petToEdit.name,
        species: petToEdit.species,
        birthDate: petToEdit.birthDate.split('T')[0],
        description: petToEdit.description,
        tamanho: petToEdit.tamanho || "",
        personalidade: petToEdit.personalidade || "",
        status: petToEdit.status,
        image: null,
      });
    } else {
      setFormData({ name: "", species: "", birthDate: "", description: "", tamanho: "", personalidade: "", status: "disponivel", image: null });
    }
  }, [petToEdit]);

  const createPetMutation = useMutation({
    mutationFn: async (newPetData: FormData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: newPetData,
      });
      if (!response.ok) {
        throw new Error("Falha ao cadastrar o pet.");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPets'] });
      toast({ title: "Sucesso!", description: "Pet cadastrado com sucesso!" });
      onClose();
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message || "Não foi possível cadastrar o pet.", variant: "destructive" });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async (updatedPetData: { id: number, data: FormData }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets/${updatedPetData.id}`,
        {
          method: "PUT",
          headers: { 'Authorization': `Bearer ${token}` },
          body: updatedPetData.data,
        }
      );
      if (!response.ok) {
        throw new Error("Falha ao atualizar o pet.");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPets'] });
      toast({ title: "Sucesso!", description: "Pet atualizado com sucesso!" });
      onClose();
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message || "Não foi possível atualizar o pet.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("species", formData.species);
    data.append("birthDate", formData.birthDate);
    data.append("description", formData.description);
    if (formData.tamanho) data.append("tamanho", formData.tamanho);
    if (formData.personalidade) data.append("personalidade", formData.personalidade);
    if (formData.status) data.append("status", formData.status);
    if (formData.image) data.append("image", formData.image);

    if (petToEdit) {
      updatePetMutation.mutate({ id: petToEdit.id, data });
    } else {
      createPetMutation.mutate(data);
    }
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isPending = createPetMutation.isPending || updatePetMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{petToEdit ? 'Editar Pet' : 'Cadastrar Novo Pet'}</DialogTitle>
          <DialogDescription>
            {petToEdit ? 'Edite as informações do pet.' : 'Preencha as informações abaixo para cadastrar um novo pet.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Pet *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="species">Espécie *</Label>
              <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)} disabled={isPending}>
                <SelectTrigger><SelectValue placeholder="Selecione a espécie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CACHORRO">Cachorro</SelectItem>
                  <SelectItem value="GATO">Gato</SelectItem>
                  <SelectItem value="COELHO">Coelho</SelectItem>
                  <SelectItem value="HAMSTER">Hamster</SelectItem>
                  <SelectItem value="PASSARO">Pássaro</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento (aproximada) *</Label>
              <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => handleInputChange("birthDate", e.target.value)} required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho</Label>
              <Select value={formData.tamanho} onValueChange={(value) => handleInputChange("tamanho", value)} disabled={isPending}>
                <SelectTrigger><SelectValue placeholder="Selecione o tamanho" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEQUENO">Pequeno</SelectItem>
                  <SelectItem value="MEDIO">Médio</SelectItem>
                  <SelectItem value="GRANDE">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalidade">Personalidade</Label>
            <Input id="personalidade" placeholder="Ex: Brincalhão, Carinhoso, Calmo (separado por vírgulas)" value={formData.personalidade} onChange={(e) => handleInputChange("personalidade", e.target.value)} disabled={isPending} />
            <p className="text-sm text-muted-foreground">Descreva as características da personalidade separadas por vírgulas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea id="description" placeholder="Conte sobre a personalidade do pet, cuidados especiais, comportamento..." value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required rows={4} disabled={isPending} />
            <p className="text-sm text-muted-foreground">Forneça uma descrição detalhada que ajude futuros adotantes a conhecer o pet</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)} disabled={isPending}>
              <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="adotado">Adotado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Pet</Label>
            <Input id="image" type="file" accept="image/*" onChange={(e) => handleInputChange("image", e.target.files ? e.target.files[0] : null)} disabled={isPending} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {petToEdit ? 'Salvar Alterações' : 'Cadastrar Pet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente para listar e gerenciar pets
const ListPets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const { data: pets, isLoading, isError, error } = useQuery<Pet[]>({
    queryKey: ['adminPets'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets/admin`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar pets.');
      }
      return response.json();
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar pet.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPets'] });
      toast({ title: 'Sucesso', description: 'Pet deletado com sucesso.' });
    },
    onError: (err) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este pet?')) {
      deletePetMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-center">Carregando pets...</div>;
  if (isError) return <div className="text-center text-destructive">Erro: {error?.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          setEditingPet(null);
          setIsModalOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Pet
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Espécie</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Imagem</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets?.map((pet) => (
            <TableRow key={pet.id}>
              <TableCell>{pet.id}</TableCell>
              <TableCell>{pet.name}</TableCell>
              <TableCell>{pet.species}</TableCell>
              <TableCell>{pet.status}</TableCell>
              <TableCell>
                {pet.imageUrl && <img src={`${import.meta.env.VITE_API_URL}${pet.imageUrl}`} alt={pet.name} className="h-10 w-10 object-cover rounded-full" />}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(pet)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(pet.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RegisterPetForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        petToEdit={editingPet}
      />
    </div>
  );
};

const AdminPetManagement = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Gerenciamento de Pets</h1>
        <ListPets />
      </main>
    </div>
  );
};

export default AdminPetManagement;