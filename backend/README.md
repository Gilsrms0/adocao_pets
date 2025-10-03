# Backend - Sistema de Adoção de Pets

Este é o backend para o sistema de adoção de pets "AdoteMe". Ele é responsável por gerenciar os dados de pets, adotantes, e o processo de adoção, além de fornecer uma API RESTful para o frontend.

## ✨ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express.js**: Framework para construção da API RESTful.
- **Prisma**: ORM para interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **JSON Web Tokens (JWT)**: Para autenticação e autorização de rotas.
- **Bcrypt.js**: Para hashing de senhas.
- **Multer**: Middleware para upload de imagens dos pets.
- **Dotenv**: Para gerenciamento de variáveis de ambiente.
- **CORS**: Para permitir requisições de diferentes origens (frontend).

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v18+)
- [NPM](https://www.npmjs.com/) ou outro gerenciador de pacotes
- [PostgreSQL](https://www.postgresql.org/download/) Server em execução

## 🚀 Como Começar

1.  **Clone o repositório** e navegue até a pasta do backend:
    ```bash
    git clone https://github.com/seu-usuario/adocao_pets.git
    cd adocao_pets/backend
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**

    Crie um arquivo chamado `.env` na raiz do diretório `backend/` e preencha com as seguintes variáveis:

    ```env
    # URL de Conexão com o PostgreSQL
    # Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL="postgresql://user:password@localhost:5432/adocao_pets_db?schema=public"

    # Chave Secreta para gerar tokens JWT (use um valor longo e aleatório)
    JWT_SECRET="SUA_CHAVE_SECRETA_FORTE_AQUI"

    # Chave secreta para permitir o registro de um usuário como ADMIN
    SECRET_ADMIN_KEY="SUA_CHAVE_SECRETA_DE_ADMIN_AQUI"

    # Porta em que o servidor irá rodar
    PORT=3001
    ```

4.  **Execute as Migrations do Banco de Dados**

    Este comando cria as tabelas no seu banco de dados com base no `schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **(Opcional) Popule o Banco com Dados Iniciais**

    Para adicionar dados de exemplo (pets, usuários), execute:
    ```bash
    npx prisma db seed
    ```

## ▶️ Executando a Aplicação

- **Modo de Desenvolvimento**: Inicia o servidor com hot-reload.
  ```bash
  npm run dev
  ```

- **Modo de Produção**: Inicia o servidor para produção.
  ```bash
  npm start
  ```

O servidor estará disponível em `http://localhost:3001` (ou na porta definida no `.env`).

## 🗺️ Endpoints da API

A seguir está um resumo das rotas disponíveis. Todas são prefixadas com `/api`.

--- 

### 🔑 Autenticação (`/auth`)

-   **`POST /register`**: Cria um novo usuário. Se a `adminKey` correta for enviada no corpo, o usuário será criado como `ADMIN`.
-   **`POST /login`**: Autentica um usuário e retorna um token JWT.

--- 

### 🐾 Pets (`/pets`)

-   **`GET /`**: Lista pets com suporte a filtros, busca e paginação.
    -   **Query Params**: `page` (nº da página), `pageSize` (itens por página), `status`, `species`, `search` (busca por nome/descrição).
    -   **Acesso**: Público.
-   **`GET /:id`**: Retorna os detalhes de um pet específico.
    -   **Acesso**: Público.
-   **`POST /`**: Cria um novo pet.
    -   **Acesso**: Admin (requer token).
    -   **Corpo**: `multipart/form-data` com os dados do pet e a imagem.
-   **`PUT /:id`**: Atualiza um pet.
    -   **Acesso**: Admin (requer token).
-   **`DELETE /:id`**: Deleta um pet.
    -   **Acesso**: Admin (requer token).

---

### 🧑 Adotantes (`/adotantes`)

-   **`GET /`**: Lista todos os adotantes.
    -   **Acesso**: Admin (requer token).
-   **`GET /me/adoption-requests`**: Lista os pedidos de adoção feitos pelo usuário logado.
    -   **Acesso**: Autenticado (qualquer usuário logado).

---

### ❤️ Pedidos de Adoção (`/adoption-requests`)

-   **`POST /`**: Cria um novo pedido de adoção.
    -   **Acesso**: Autenticado (qualquer usuário logado).
-   **`GET /`**: Lista todos os pedidos de adoção.
    -   **Acesso**: Admin (requer token).
-   **`PATCH /:id/status`**: Atualiza o status de um pedido (`PENDING`, `APPROVED`, `REJECTED`).
    -   **Acesso**: Admin (requer token).
