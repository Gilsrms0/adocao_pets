import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Heart, Users, Home, Calendar, Info, Search, Filter, CheckCircle, Phone, FileText, PlusCircle, Facebook, Instagram, Twitter, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-pets.jpg";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/layout/Header";

// Types
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



interface AdopterFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  petId: string;
}

const AdoptionFormModal = ({ isOpen, onClose, pets }: { isOpen: boolean; onClose: () => void; pets: Pet[]; }) => {
  const [formData, setFormData] = useState({ adopterName: "", adopterEmail: "", adopterPhone: "", adopterAddress: "", petId: "" });
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao enviar solicitação.");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Sua solicitação de adoção foi enviada! Entraremos em contato em breve." });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      onClose();
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const handlePetChange = (petId: string) => {
    const pet = pets.find(p => p.id.toString() === petId);
    setSelectedPet(pet || null);
    setFormData(prev => ({ ...prev, petId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petId) {
      toast({ title: "Atenção", description: "Por favor, selecione um pet.", variant: "destructive" });
      return;
    }
    createRequestMutation.mutate(formData);
  };

  const isPending = createRequestMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Formulário de Adoção</DialogTitle>
          <DialogDescription>
            Preencha seus dados e escolha o pet que deseja adotar. Entraremos em contato em breve!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" value={formData.adopterName} onChange={e => setFormData(prev => ({ ...prev, adopterName: e.target.value }))} required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={formData.adopterEmail} onChange={e => setFormData(prev => ({ ...prev, adopterEmail: e.target.value }))} required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={formData.adopterPhone} onChange={e => setFormData(prev => ({ ...prev, adopterPhone: e.target.value }))} required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" value={formData.adopterAddress} onChange={e => setFormData(prev => ({ ...prev, adopterAddress: e.target.value }))} required disabled={isPending} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="petId">Escolha o Pet</Label>
            <Select value={formData.petId} onValueChange={handlePetChange} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pet..." />
              </SelectTrigger>
              <SelectContent>
                {pets.filter(p => p.status === 'disponivel').map(pet => (
                  <SelectItem key={pet.id} value={pet.id.toString()}>{pet.name} - {pet.species}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedPet && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold">Detalhes do Pet</h4>
              <p><strong>Espécie:</strong> {selectedPet.species}</p>
              <p><strong>Idade:</strong> {new Date().getFullYear() - new Date(selectedPet.birthDate).getFullYear()} anos</p>
              <p><strong>Tamanho:</strong> {selectedPet.tamanho}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enviando..." : "Enviar Pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};



// Hero Section Component
const HeroSection = () => {
  const [isAdoptionFormOpen, setIsAdoptionFormOpen] = useState(false);

  const { data: pets } = useQuery<Pet[]>({ 
    queryKey: ['pets', 'all', 'disponivel'], 
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/pets?status=disponivel`).then(res => res.json()),
    initialData: [],
  });

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Pets felizes no abrigo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-75"></div>
        </div>
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Encontre seu
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Melhor Amigo
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Conectamos corações. Cada pet merece uma família amorosa,
              e cada família merece a alegria de um companheiro fiel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-semibold"
                onClick={() => document.getElementById('pets')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Heart className="w-5 h-5 mr-2" />
                Ver Pets Disponíveis
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-semibold"
                onClick={() => setIsAdoptionFormOpen(true)}
              >
                <Heart className="w-5 h-5 mr-2" />
                Adotar Agora
              </Button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-white/80">Pets Adotados</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-white/80">Famílias Felizes</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-white/80">Pets Disponíveis</div>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </div>
      </section>
      <AdoptionFormModal 
        isOpen={isAdoptionFormOpen} 
        onClose={() => setIsAdoptionFormOpen(false)} 
        pets={pets || []} 
      />
    </>
  );
};

// Pet Card Component
const PetCard = ({ pet, onAdopt, onViewDetails }: { pet: Pet; onAdopt?: (petId: number) => void; onViewDetails?: (pet: Pet) => void; }) => {
  const [isLiked, setIsLiked] = useState(false);
  const getAge = (birthDate: string) => {
    if (!birthDate) return "Idade desconhecida";
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    if (months < 12) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(months / 12);
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  };
  const getSizeColor = (size?: string) => {
    switch (size) {
      case 'PEQUENO': return 'bg-accent text-accent-foreground';
      case 'MEDIO': return 'bg-secondary text-secondary-foreground';
      case 'GRANDE': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const getPersonalityTraits = (personality?: string) => {
    if (!personality) return [];
    return personality.split(',').map(trait => trait.trim());
  }
  const personalityTraits = getPersonalityTraits(pet.personalidade);

  return (
    <Card className="group hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 bg-card border-border overflow-hidden">
      <div className="relative">
        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
          {pet.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${pet.imageUrl}`}
              alt={pet.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <Heart className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
        </div>
        {/* Like button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-all duration-300",
            isLiked && "bg-red-50 text-red-500"
          )}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={cn("w-5 h-5 transition-all duration-300", isLiked && "fill-current")}
          />
        </Button>
        {/* Status badge */}
        <Badge
          variant={pet.status === 'disponivel' ? 'default' : 'secondary'}
          className="absolute top-3 left-3 bg-gradient-primary text-white font-semibold"
        >
          {pet.status === 'disponivel' ? 'Disponível' : 'Adotado'}
        </Badge>
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{pet.name}</h3>
          <div className="flex items-center text-muted-foreground text-sm space-x-4">
            <span className="font-medium">{pet.species}</span>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {getAge(pet.birthDate)}
            </div>
          </div>
        </div>
        {pet.tamanho && (
          <Badge className={getSizeColor(pet.tamanho)}>
            {pet.tamanho.charAt(0).toUpperCase() + pet.tamanho.slice(1).toLowerCase()}
          </Badge>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {pet.description}
        </p>
        {personalityTraits.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {personalityTraits.slice(0, 2).map((trait, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {trait}
              </Badge>
            ))}
            {personalityTraits.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{personalityTraits.length - 2} mais
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails?.(pet)}
        >
          <Info className="w-4 h-4 mr-2" />
          Ver Mais
        </Button>
        {pet.status === 'disponivel' && (
          <Button
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            onClick={() => onAdopt?.(pet.id)}
          >
            <Heart className="w-4 h-4 mr-2" />
            Adotar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Pet Modal Component
const PetModal = ({ pet, isOpen, onClose, onAdopt, isAdopting }: { pet: Pet; isOpen: boolean; onClose: () => void; onAdopt?: (petId: number) => void; isAdopting: boolean; }) => {
  const getAge = (birthDate: string) => {
    if (!birthDate) return "Idade desconhecida";
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    if (months < 12) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(months / 12);
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  };
  const getSizeLabel = (size?: string) => {
    switch (size) {
      case 'PEQUENO': return 'Pequeno';
      case 'MEDIO': return 'Médio';
      case 'GRANDE': return 'Grande';
      default: return 'Não informado';
    }
  };
  const getPersonalityTraits = (personality?: string) => {
    if (!personality) return [];
    return personality.split(',').map(trait => trait.trim());
  }
  const personalityTraits = getPersonalityTraits(pet.personalidade);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {pet.name}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {pet.species} • {getAge(pet.birthDate)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Pet Image */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {pet.imageUrl ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${pet.imageUrl}`}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                <Heart className="w-24 h-24 text-white opacity-50" />
              </div>
            )}
            {/* Status Badge */}
            <Badge
              variant={pet.status === 'disponivel' ? 'default' : 'secondary'}
              className="absolute top-4 left-4 bg-gradient-primary text-white font-semibold"
            >
              {pet.status === 'disponivel' ? 'Disponível' : 'Adotado'}
            </Badge>
          </div>
          {/* Pet Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Informações Básicas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Espécie:</span>
                    <span className="text-foreground font-medium">{pet.species}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idade:</span>
                    <span className="text-foreground font-medium">{getAge(pet.birthDate)}</span>
                  </div>
                  {pet.tamanho && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span className="text-foreground font-medium">{getSizeLabel(pet.tamanho)}</span>
                    </div>
                  )}
                </div>
              </div>
              {personalityTraits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Personalidade</h4>
                  <div className="flex flex-wrap gap-2">
                    {personalityTraits.map((trait, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Sobre {pet.name}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pet.description}
              </p>
            </div>
          </div>
          {/* Action Buttons */}
          {pet.status === 'disponivel' && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Fechar
              </Button>
              <Button
                className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                onClick={() => {
                  onAdopt?.(pet.id);
                  onClose();
                }}
                disabled={isAdopting}
              >
                {isAdopting ? "Adotando..." : `Quero Adotar ${pet.name}`}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Adoption Modal Component
const AdoptionModal = ({ petId, isOpen, onClose, onConfirm, isPending }: { petId: number | null; isOpen: boolean; onClose: () => void; onConfirm: (adopterId: string) => void; isPending: boolean; }) => {
  const [adopterId, setAdopterId] = useState("");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (adopterId) {
      onConfirm(adopterId);
    } else {
      toast({
        title: "Aviso",
        description: "ID do adotante é necessário para registrar a adoção.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen || petId === null) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Adoção</DialogTitle>
          <DialogDescription>
            Para continuar, por favor, insira o ID do adotante. Esta informação será substituída por um sistema de login no futuro.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label htmlFor="adopterId" className="text-foreground font-semibold">ID do Adotante</Label>
          <Input
            id="adopterId"
            value={adopterId}
            onChange={(e) => setAdopterId(e.target.value)}
            placeholder="Insira o ID do adotante"
            className="bg-background border-border"
          />
        </div>
        <Button onClick={handleConfirm} disabled={!adopterId || isPending} className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
          {isPending ? "Registrando..." : "Confirmar Adoção"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// Pets Section Component
const PetsSection = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [adoptionPetId, setAdoptionPetId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("all");
  const [filterStatus, setFilterStatus] = useState("available");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchPets = async (species: string, status: string) => {
    const params = new URLSearchParams();
    if (species !== "all") {
      params.append("species", species);
    }
    if (status !== "all") {
      params.append("status", status);
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/pets?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Ocorreu um erro ao buscar os pets.");
    }
    return response.json();
  };

  const { data: petsFromApi, isLoading, isError, error } = useQuery<Pet[]>(
    {
      queryKey: ['pets', filterSpecies, filterStatus],
      queryFn: () => fetchPets(filterSpecies, filterStatus),
    }
  );

  const adoptPetMutation = useMutation({
    mutationFn: async ({ petId, adopterId }: { petId: number; adopterId: string }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/adocoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId, adopterId }),
      });
      if (!response.ok) {
        throw new Error("Falha ao registrar a adoção.");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Adoção registrada com sucesso! O pet foi marcado como adotado.",
      });
      queryClient.invalidateQueries({ queryKey: ['pets'] }); // Refresh pet list
      setAdoptionPetId(null); // Close modal on success
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível registrar a adoção.",
        variant: "destructive",
      });
    },
  });

  const filteredPets = petsFromApi?.filter(pet => {
    if (!searchTerm) return true;
    return pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pet.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAdopt = (petId: number) => {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConfirmAdoption = (adopterId: string) => {
    if (adoptionPetId) {
      adoptPetMutation.mutate({ petId: adoptionPetId, adopterId });
    }
  };

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
  };

  return (
    <section id="pets" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossos <span className="bg-gradient-primary bg-clip-text text-transparent">Pets Especiais</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça nossos pets que estão em busca de uma família amorosa.
            Cada um tem sua personalidade única e muito amor para oferecer.
          </p>
        </div>
        {/* Filters */}
        <div className="mb-12 bg-card rounded-2xl p-6 shadow-card">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={filterSpecies} onValueChange={setFilterSpecies}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Espécie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="CACHORRO">Cachorro</SelectItem>
                  <SelectItem value="GATO">Gato</SelectItem>
                  <SelectItem value="COELHO">Coelho</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="adotado">Adotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Carregando pets...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-16 bg-destructive/10 text-destructive rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-2">Ocorreu um erro</h3>
            <p>{(error as Error)?.message || "Não foi possível carregar os pets. Tente novamente mais tarde."}</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <>
            {/* Results count */}
            <div className="mb-8">
              <p className="text-muted-foreground">
                {filteredPets?.length} {filteredPets?.length === 1 ? 'pet encontrado' : 'pets encontrados'}
              </p>
            </div>
            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPets?.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onAdopt={handleAdopt}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            {/* Empty State */}
            {filteredPets?.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Nenhum pet encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Tente ajustar os filtros ou termo de busca
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSpecies("all");
                    setFilterStatus("available");
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </>
        )}

        {/* Pet Details Modal */}
        {selectedPet && (
          <PetModal
            pet={selectedPet}
            isOpen={!!selectedPet}
            onClose={() => setSelectedPet(null)}
            onAdopt={handleAdopt}
            isAdopting={false}
          />
        )}

        {/* Adoption Modal */}
        <AdoptionModal
          petId={adoptionPetId}
          isOpen={!!adoptionPetId}
          onClose={() => setAdoptionPetId(null)}
          onConfirm={handleConfirmAdoption}
          isPending={adoptPetMutation.isPending}
        />
      </div>
    </section>
  );
};

// How to Adopt Section Component
const HowToAdoptSection = () => {
  const steps = [
    { icon: Search, title: "1. Encontre seu Pet", description: "Navegue pela nossa galeria de pets disponíveis e encontre aquele que conquistou seu coração.", color: "text-primary" },
    { icon: FileText, title: "2. Preencha o Formulário", description: "Complete o formulário de interesse com suas informações de contato e preferências.", color: "text-secondary" },
    { icon: Phone, title: "3. Entrevista e Visita", description: "Nossa equipe entrará em contato para agendar uma conversa e visita ao abrigo.", color: "text-accent" },
    { icon: CheckCircle, title: "4. Aprovação", description: "Após a avaliação, você receberá a confirmação da aprovação da adoção.", color: "text-secondary" },
    { icon: Home, title: "5. Leve para Casa", description: "Finalize a documentação e leve seu novo melhor amigo para casa com muito amor!", color: "text-primary" }
  ];
  const requirements = [
    "Ser maior de 18 anos",
    "Ter residência fixa",
    "Comprovar renda estável",
    "Apresentar documento de identidade",
    "Ter tempo disponível para cuidados",
    "Concordar com visita de acompanhamento"
  ];
  return (
    <section id="how-to-adopt" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Como <span className="bg-gradient-primary bg-clip-text text-transparent">Adotar</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            O processo de adoção é simples e pensado para garantir o bem-estar dos pets e a felicidade das famílias.
          </p>
        </div>
        {/* Steps */}
        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-center text-foreground mb-12">
            Passos para Adoção
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-primary group-hover:text-white transition-all duration-300">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Requisitos para Adoção
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Para garantir o bem-estar dos nossos pets, estabelecemos alguns requisitos básicos
              que todos os adotantes devem atender:
            </p>
            <div className="space-y-4">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="text-center mb-6">
              <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-foreground mb-2">
                Pronto para Adotar?
              </h4>
              <p className="text-muted-foreground">
                Faça parte da nossa família e dê uma nova chance a um pet especial.
              </p>
            </div>
            <div className="space-y-4">
              <Button
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Ver Pets Disponíveis
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Entrar em Contato
              </Button>
            </div>
          </div>
        </div>
        {/* Contact Info */}
        <div className="mt-16 text-center bg-muted/30 rounded-2xl p-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Dúvidas sobre o processo?
          </h3>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Nossa equipe está sempre disponível para esclarecer qualquer dúvida
            sobre adoção e ajudar você a encontrar o pet perfeito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-center">
              <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-semibold text-foreground">(11) 99999-9999</p>
            </div>
            <div className="hidden sm:block w-px bg-border"></div>
            <div className="text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-semibold text-foreground">contato@adoteme.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];
  const quickLinks = [
    { name: "Início", href: "#home" },
    { name: "Pets Disponíveis", href: "#pets" },
    { name: "Como Adotar", href: "#how-to-adopt" },
    { name: "Sobre Nós", href: "#about" }
  ];
  const supportLinks = [
    { name: "FAQ", href: "#faq" },
    { name: "Contato", href: "#contact" },
    { name: "Políticas", href: "#policies" },
    { name: "Termos de Uso", href: "#terms" },
    { name: "Privacidade", href: "#privacy" }
  ];
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AdoteMe
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Conectamos corações e criamos famílias. Nosso objetivo é encontrar
              o lar perfeito para cada pet e o companheiro ideal para cada família.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                  <span className="sr-only">{social.label}</span>
                </Button>
              ))}
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Suporte</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="text-foreground font-medium">(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="text-foreground font-medium">contato@adoteme.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="text-foreground font-medium">
                    Rua dos Pets, 123<br />
                    Jardim Animal - SP<br />
                    CEP: 01234-567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-12" />
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            {currentYear} AdoteMe. Todos os direitos reservados.
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            Feito com <Heart className="w-4 h-4 mx-1 text-red-500" fill="currentColor" /> para nossos
            amigos de quatro patas
          </div>
        </div>
        {/* Call to Action */}
        {/*<div className="mt-12 text-center bg-gradient-primary/5 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Pronto para Fazer a Diferença?
          </h3>
          <p className="text-muted-foreground mb-6">
            Junte-se a nós e ajude a conectar pets especiais com famílias amorosas.
          </p>
          {/*<Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
            <Heart className="w-4 h-4 mr-2" />
            Adotar Agora
          </Button>
        </div>*/}
      </div>
    </footer>
  );
};

// Main Index Component
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PetsSection />
        <HowToAdoptSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
