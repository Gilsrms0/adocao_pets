import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Navigate } from "react-router-dom";

// Register Pet Form Component (extracted from Index.tsx)
const RegisterPetForm = () => {
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
  const { token } = useAuth(); // Get token for authenticated request

  const createPetMutation = useMutation({
    mutationFn: async (newPet: FormData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: newPet,
      });
      if (!response.ok) {
        throw new Error("Falha ao cadastrar o pet.");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Pet cadastrado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setFormData({
        nome: "",
        especie: "",
        dataNascimento: "",
        descricao: "",
        tamanho: "",
        personalidade: "",
        imagem: null,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cadastrar o pet.",
        variant: "destructive",
      });
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="register-pet" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Cadastrar</span> Pet
            </h2>
            <p className="text-xl text-muted-foreground">
              Ajude-nos a encontrar um lar amoroso para um pet especial.
              Preencha as informações abaixo para cadastrar um novo pet.
            </p>
          </div>
          {/* Form */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Novo Pet</h3>
                  <p className="text-muted-foreground">Preencha os dados do pet</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome do Pet */}
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-foreground font-semibold">
                    Nome do Pet *
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome do pet"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    required
                    className="bg-background border-border"
                  />
                </div>
                {/* Espécie e Tamanho */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="especie" className="text-foreground font-semibold">
                      Espécie *
                    </Label>
                    <Select
                      value={formData.especie}
                      onValueChange={(value) => handleInputChange("especie", value)}
                    >
                      <SelectTrigger id="especie" className="bg-background border-border">
                        <SelectValue placeholder="Selecione a espécie" />
                      </SelectTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="tamanho" className="text-foreground font-semibold">
                      Tamanho
                    </Label>
                    <Select
                      value={formData.tamanho}
                      onValueChange={(value) => handleInputChange("tamanho", value)}
                    >
                      <SelectTrigger id="tamanho" className="bg-background border-border">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEQUENO">Pequeno</SelectItem>
                        <SelectItem value="MEDIO">Médio</SelectItem>
                        <SelectItem value="GRANDE">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Data de Nascimento */}
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento" className="text-foreground font-semibold">
                    Data de Nascimento (aproximada) *
                  </Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                    required
                    className="bg-background border-border"
                  />
                </div>
                {/* Personalidade */}
                <div className="space-y-2">
                  <Label htmlFor="personalidade" className="text-foreground font-semibold">
                    Personalidade
                  </Label>
                  <Input
                    id="personalidade"
                    placeholder="Ex: Brincalhão, Carinhoso, Calmo (separado por vírgulas)"
                    value={formData.personalidade}
                    onChange={(e) => handleInputChange("personalidade", e.target.value)}
                    className="bg-background border-border"
                  />
                  <p className="text-sm text-muted-foreground">
                    Descreva as características da personalidade separadas por vírgulas
                  </p>
                </div>
                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-foreground font-semibold">
                    Descrição *
                  </Label>
                  <Textarea
                    id="descricao"
                    placeholder="Conte sobre a personalidade do pet, cuidados especiais, comportamento..."
                    value={formData.descricao}
                    onChange={(e) => handleInputChange("descricao", e.target.value)}
                    required
                    rows={4}
                    className="bg-background border-border"
                  />
                  <p className="text-sm text-muted-foreground">
                    Forneça uma descrição detalhada que ajude futuros adotantes a conhecer o pet
                  </p>
                </div>
                {/* Imagem do Pet */}
                <div className="space-y-2">
                  <Label htmlFor="imagem" className="text-foreground font-semibold">
                    Imagem do Pet
                  </Label>
                  <Input
                    id="imagem"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange("imagem", e.target.files ? e.target.files[0] : null)}
                    className="bg-background border-border"
                  />
                </div>
                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                    disabled={createPetMutation.isPending}
                  >
                    {createPetMutation.isPending ? "Cadastrando..." : "Cadastrar Pet"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* Info Card */}
          <div className="mt-8 bg-gradient-primary/5 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-start space-x-4">
              <Heart className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Obrigado por ajudar!
                </h4>
                <p className="text-muted-foreground text-sm">
                  Cada pet cadastrado é uma nova oportunidade de encontrar uma família amorosa.
                  Nossa equipe analisará as informações e o pet ficará disponível para adoção em breve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminPetManagement = () => {
  const { user, isAuthenticated } = useAuth();

  // Redireciona se não estiver autenticado ou não for admin
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RegisterPetForm />
      </main>
    </div>
  );
};

export default AdminPetManagement;
