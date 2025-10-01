import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, PawPrint, PlusCircle, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Modal de Cadastro de Pet
const RegisterPetModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    dataNascimento: "",
    descricao: "",
    tamanho: "",
    personalidade: "",
    imagem: null as File | null,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { token } = useAuth();

  const createPetMutation = useMutation({
    mutationFn: async (newPet: FormData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: newPet,
      });
      if (!response.ok) {
        throw new Error("Falha ao cadastrar o pet.");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Pet cadastrado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setFormData({ nome: "", especie: "", dataNascimento: "", descricao: "", tamanho: "", personalidade: "", imagem: null });
      onClose();
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.nome);
    data.append("species", formData.especie);
    data.append("birthDate", formData.dataNascimento);
    data.append("description", formData.descricao);
    if (formData.tamanho) data.append("tamanho", formData.tamanho);
    if (formData.personalidade) data.append("personalidade", formData.personalidade);
    if (formData.imagem) data.append("image", formData.imagem);

    createPetMutation.mutate(data);
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Pet</DialogTitle>
          <DialogDescription>Preencha as informações abaixo para cadastrar um novo pet para adoção.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Pet *</Label>
              <Input id="nome" value={formData.nome} onChange={(e) => handleInputChange("nome", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="especie">Espécie *</Label>
              <Select value={formData.especie} onValueChange={(value) => handleInputChange("especie", value)}>
                <SelectTrigger><SelectValue placeholder="Selecione a espécie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CACHORRO">Cachorro</SelectItem>
                  <SelectItem value="GATO">Gato</SelectItem>
                  <SelectItem value="COELHO">Coelho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataNascimento">Data de Nascimento (aproximada) *</Label>
            <Input id="dataNascimento" type="date" value={formData.dataNascimento} onChange={(e) => handleInputChange("dataNascimento", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem do Pet</Label>
            <Input id="imagem" type="file" accept="image/*" onChange={(e) => handleInputChange("imagem", e.target.files ? e.target.files[0] : null)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea id="descricao" value={formData.descricao} onChange={(e) => handleInputChange("descricao", e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={createPetMutation.isPending}>Cancelar</Button>
            <Button type="submit" disabled={createPetMutation.isPending}>
              {createPetMutation.isPending ? "Cadastrando..." : "Cadastrar Pet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isRegisterPetModalOpen, setIsRegisterPetModalOpen] = useState(false);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Dashboard Administrativo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card de Gerenciamento de Adotantes */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-medium">Gerenciar Adotantes</CardTitle>
                <Users className="h-8 w-8 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Visualize, adicione, edite e remova adotantes.</p>
                <Button asChild>
                  <Link to="/admin/adotantes">
                    <Users className="h-4 w-4 mr-2" />
                    Ver Adotantes
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Card de Gerenciamento de Pets */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-medium">Gerenciar Pets</CardTitle>
                <PawPrint className="h-8 w-8 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Visualize, adicione, edite e remova pets.</p>
                <Button asChild>
                  <Link to="/admin/pets">
                    <PawPrint className="h-4 w-4 mr-2" />
                    Ver Pets
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Card de Cadastro Rápido de Pet */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-medium">Cadastrar Novo Pet</CardTitle>
                <PlusCircle className="h-8 w-8 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Adicione rapidamente um novo pet para adoção.</p>
                <Button onClick={() => setIsRegisterPetModalOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Cadastrar Pet
                </Button>
              </CardContent>
            </Card>

            {/* Card de Solicitações de Adoção */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-medium">Solicitações</CardTitle>
                <Mail className="h-8 w-8 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Aprove ou recuse os pedidos de adoção.</p>
                <Button asChild>
                  <Link to="/admin/solicitacoes">
                    <Mail className="h-4 w-4 mr-2" />
                    Ver Solicitações
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <RegisterPetModal isOpen={isRegisterPetModalOpen} onClose={() => setIsRegisterPetModalOpen(false)} />
    </>
  );
};

export default AdminDashboard;
