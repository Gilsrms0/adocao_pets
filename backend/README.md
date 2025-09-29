🐾 Sistema de Adoção de Pets - Backend
Este repositório contém a API RESTful que serve como o coração do seu sistema de adoção de pets. Ele gerencia dados de pets, adotantes, autenticação de usuários e o upload de imagens.

🛠️ Tecnologias Utilizadas
| Componente | Tecnologia Principal | Descrição |
| :--- | :--- | :--- |
| Linguagem | Node.js (Express) | Servidor rápido e escalável. |
| Banco de Dados | PostgreSQL | BD relacional de alta performance. |
| ORM | Prisma | Gerenciamento de esquema e consultas SQL. |
| Autenticação | JWT, bcryptjs | Segura o acesso às rotas de administrador. |
| Uploads | Multer | Middleware para processamento de multipart/form-data (imagens). |

🚀 Configuração e Instalação (Backend)
Siga estes passos para configurar e executar a API localmente.

### 1. Pré-requisitos
- Node.js: Versão 18+ (Recomendado: v20+).
- npm ou Yarn: Gerenciador de pacotes.
- PostgreSQL Server: Servidor rodando localmente e acessível.

### 2. Configuração do Banco de Dados
- Crie um Banco de Dados Vazio no seu servidor PostgreSQL. Exemplo: `pet_adoption_db`.
- Obtenha suas Credenciais (Usuário, Senha, Host e Porta).

### 3. Instalação e Ambiente
Navegue até o diretório `backend/`.

#### a. Instalação de Dependências
```bash
npm install # ou yarn install
```

#### b. Variáveis de Ambiente (.env)
Crie o arquivo `.env` na raiz do diretório `backend/` com as seguintes variáveis. Atenção: Adapte a `DATABASE_URL` com suas credenciais do PostgreSQL.

```env
# 🚨 URL de Conexão com o PostgreSQL
# Exemplo: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="postgresql://user_postgres:minhasenha@localhost:5432/pet_adoption_db?schema=public" 

# Chave Secreta do JWT para Assinatura de Tokens
JWT_SECRET="SEGREDO_SUPER_SECRETO" 

# Chave Secreta para o Registro de Administrador
SECRET_ADMIN_KEY="sua_chave_secreta_aqui"
```

#### c. Migração do Prisma (Criação de Tabelas)
Aplique o esquema definido no seu arquivo `schema.prisma` ao banco de dados:
```bash
npx prisma migrate dev --name init_postgres
```

#### d. Inicialização da Pasta de Uploads (CRÍTICO)
O Multer requer que a pasta de destino exista. Crie-a manualmente na raiz do `backend/`:
```bash
mkdir uploads
```

### 4. Execução do Servidor
Inicie a API em modo de desenvolvimento:
```bash
npm run dev 
```
O Backend (API) estará rodando em `http://localhost:3001`.

## 🗺️ Rotas da API
Todas as rotas são prefixadas por `/api`.

### 🔑 Rotas de Autenticação (`/api/auth`)
| Rota | Método | Descrição |
| :--- | :--- | :--- |
| `/api/auth/register` | POST | Cria um novo usuário (ADOTANTE). Inclua `adminKey` para criar um ADM. |
| `/api/auth/login` | POST | Autentica o usuário e retorna o JWT. |

### 🐾 Rotas de Pets (`/api/pets`)
As rotas marcadas como (ADM) requerem o envio de um token JWT válido no cabeçalho `Authorization: Bearer <token>`.

| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/api/pets` | GET | Pública | Lista pets com status: 'disponivel'. |
| `/api/pets/admin` | GET | ADM | Lista todos os pets (disponíveis e adotados). |
| `/api/pets` | POST | ADM | Cadastra novo pet (requer `image` como `multipart/form-data`). |
| `/api/pets/:id` | GET | Pública | Busca um pet específico pelo ID. |
| `/api/pets/:id` | PUT | ADM | Atualiza dados e imagem do pet. |
| `/api/pets/data/:id` | PUT | ADM | Atualiza dados do pet sem alterar a imagem. |
| `/api/pets/:id` | DELETE | ADM | Deleta um pet. |

### 🧑 Rotas de Adotantes (`/api/adotantes`)
| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/api/adotantes` | POST | Pública | Cadastra um novo adotante. |
| `/api/adotantes` | GET | ADM | Lista todos os adotantes. |
| `/api/adotantes/:id` | GET | ADM | Busca adotante pelo ID. |

### 💡 Estrutura e Organização (`backend/src/`)
O projeto utiliza uma estrutura modular, com destaque para o módulo de configuração de caminhos (`paths.js`), que resolveu problemas de inicialização e Multer:

```
backend/src/
├── auth/
│   ├── authController.js    
│   └── authMiddleware.js    
├── config/
│   └── paths.js             # Define e exporta caminhos absolutos (ROOT_DIR, UPLOADS_PATH).
├── controllers/
│   ├── adotanteController.js
│   └── petController.js     # Contém o Multer configurado via paths.js.
├── routes/
│   ├── adotanteRoutes.js    
│   └── petRoutes.js         
└── server.js                # Ponto de entrada (usa paths.js para configurar rotas estáticas).
```
