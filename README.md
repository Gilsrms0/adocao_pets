# 🐾 Sistema de Adoção de Pets (Full-Stack)

Este projeto é uma plataforma completa para gerenciar adoções de pets, com um Backend robusto em Node.js/Express e um Frontend moderno em React/Vite. Ele visa modernizar o processo de adoção de um abrigo de animais, agilizando o cadastro de pets e facilitando a conexão com possíveis adotantes.

## ✨ Funcionalidades Principais

- **Visualização Paginada de Pets**: Navegação eficiente pela lista de animais disponíveis, com 6 pets por página.
- **Busca e Filtragem**: Ferramentas para buscar pets por nome/descrição e filtrar por espécie ou status.
- **Autenticação de Usuários**: Sistema de login e registro com JWT para diferenciar usuários comuns e administradores.
- **Painel de Administração**:
  - Gerenciamento completo de Pets (CRUD - Criar, Ler, Atualizar, Deletar).
  - Gerenciamento de Adotantes.
  - Visualização e gerenciamento de pedidos de adoção.
- **Formulário de Adoção**: Usuários logados podem enviar solicitações de adoção para os pets disponíveis.
- **Upload de Imagens**: Administradores podem adicionar e atualizar fotos dos pets.

## 🛠️ Tecnologias Utilizadas

### Backend (API)
- **Linguagem**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens), bcryptjs
- **Upload de Arquivos**: Multer

### Frontend (UI)
- **Biblioteca**: React (com TypeScript)
- **Ferramenta de Build**: Vite
- **Estilização**: Tailwind CSS & Shadcn/ui
- **Gerenciamento de Estado**: TanStack Query (React Query)
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React

## 🚀 Configuração e Execução

Siga os passos para configurar e executar a aplicação localmente.

### 1. Pré-requisitos

- **Node.js**: v18+
- **npm** (ou Yarn/pnpm)
- **PostgreSQL** Server

### 2. Backend (`/backend`)

1.  **Navegue até o diretório**: `cd backend`
2.  **Instale as dependências**: `npm install`
3.  **Configure as variáveis de ambiente**: Crie um arquivo `.env` na raiz de `/backend` e preencha-o.

    ```dotenv
    # URL de Conexão com o PostgreSQL
    # Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL="postgresql://user:password@localhost:5432/adocao_pets_db?schema=public"

    # Chave Secreta para gerar tokens JWT
    JWT_SECRET="SUA_CHAVE_SECRETA_AQUI"

    # Chave para registro de novos administradores
    SECRET_ADMIN_KEY="SUA_CHAVE_DE_ADMIN_AQUI"

    # Porta do servidor
    PORT=3001
    ```

4.  **Execute as migrações do banco**: `npx prisma migrate dev`
5.  **(Opcional) Popule o banco com dados**: `npx prisma db seed`
6.  **Inicie o servidor**: `npm run dev`
    - A API estará rodando em `http://localhost:3001`.

### 3. Frontend (`/frontend`)

1.  **Navegue até o diretório**: `cd frontend` (a partir da raiz do projeto)
2.  **Instale as dependências**: `npm install`
3.  **Configure as variáveis de ambiente**: Crie um arquivo `.env` na raiz de `/frontend`.

    ```dotenv
    # URL base da API (sem a barra no final)
    VITE_API_URL=http://localhost:3001
    ```

4.  **Inicie a aplicação**: `npm run dev`
    - O site estará acessível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

## 🗺️ Rotas da API

Todas as rotas são prefixadas por `/api`.

### 🔑 Autenticação (`/auth`)
| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | Pública | Cria um novo usuário (padrão: `ADOTANTE`). |
| `/login` | `POST` | Pública | Autentica um usuário e retorna um token JWT. |

### 🐾 Pets (`/pets`)
| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Pública | Lista pets com filtros, busca e paginação. <br> **Query Params**: `page`, `pageSize`, `status`, `species`, `search`. |
| `/:id` | `GET` | Pública | Busca um pet específico pelo ID. |
| `/` | `POST` | Admin | Cadastra um novo pet (requer `multipart/form-data`). |
| `/:id` | `PUT` | Admin | Atualiza os dados de um pet (requer `multipart/form-data`). |
| `/:id` | `DELETE` | Admin | Deleta um pet. |

### 🧑 Adotantes (`/adotantes`)
| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Admin | Lista todos os adotantes. |
| `/:id` | `GET` | Admin | Busca um adotante pelo ID. |
| `/me/adoption-requests` | `GET` | Autenticado | Lista os pedidos de adoção do usuário logado. |
| `/:id` | `PUT` | Admin | Atualiza os dados de um adotante. |
| `/:id` | `DELETE` | Admin | Deleta um adotante. |

### ❤️ Pedidos de Adoção (`/adoption-requests`)
| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Autenticado | Cria um novo pedido de adoção. |
| `/` | `GET` | Admin | Lista todos os pedidos de adoção. |
| `/:id/status` | `PATCH` | Admin | Atualiza o status de um pedido (`PENDING`, `APPROVED`, `REJECTED`). |

---