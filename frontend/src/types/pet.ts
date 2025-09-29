export interface Pet {
  id: string;
  nome: string;
  especie: string;
  dataNascimento: string;
  descricao: string;
  status: "DISPONIVEL" | "ADOTADO";
  imagemUrl?: string;
  tamanho?: "PEQUENO" | "MEDIO" | "GRANDE";
  personalidade?: string;
}

export interface Adopter {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Adoption {
  id: string;
  petId: string;
  adopterId: string;
  adoptionDate: string;
}
