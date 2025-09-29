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

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
- [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/)

## 🚀 Como Começar

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

**1. Clone o repositório**
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DO_PROJETO>/backend
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as Variáveis de Ambiente**

Crie um arquivo chamado `.env` na raiz do diretório `backend/` e adicione a seguinte variável, substituindo pelos dados do seu banco de dados PostgreSQL.

```env
# Exemplo de .env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public"
```
*   **USUARIO**: Seu nome de usuário do PostgreSQL.
*   **SENHA**: Sua senha do PostgreSQL.
*   **HOST**: Onde seu banco de dados está rodando (ex: `localhost`).
*   **PORTA**: A porta do seu banco de dados (padrão: `5432`).
*   **NOME_DO_BANCO**: O nome do banco de dados que você criou para este projeto.

**4. Execute as Migrations do Banco de Dados**

Este comando irá criar as tabelas no seu banco de dados com base no schema do Prisma.
```bash
npx prisma migrate dev
```

**5. (Opcional) Popule o Banco de Dados com Dados Iniciais**

Seu projeto possui um script para popular o banco. Para executá-lo:
```bash
npx prisma db seed
```
> **Nota:** Se você fizer alterações no arquivo `prisma/seed.js`, é necessário executar este comando novamente para que as mudanças sejam aplicadas ao seu banco de dados.

## ▶️ Executando a Aplicação

**Modo de Desenvolvimento**
Para iniciar o servidor em modo de desenvolvimento com hot-reload (reinicia automaticamente ao salvar alterações):
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:3001` (ou a porta definida em seu `.env`).

**Modo de Produção**
Para iniciar o servidor em modo de produção:
```bash
npm start
```

## 📂 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma   # Define os modelos e a conexão com o banco
│   └── migrations/     # Histórico de migrações do banco
├── src/
│   ├── auth/           # Lógica de autenticação e rotas
│   ├── config/         # Arquivos de configuração (ex: caminhos)
│   ├── controllers/    # Lógica de negócio das rotas
│   ├── routes/         # Definição dos endpoints da API
│   └── server.js       # Ponto de entrada principal do servidor
├── uploads/            # Diretório onde as imagens dos pets são salvas
├── .env                # Arquivo com variáveis de ambiente (local)
└── package.json        # Dependências e scripts do projeto
```

## Endpoints da API

A seguir está a lista de endpoints disponíveis na API.

---

### Autenticação (`/api/auth`)
*(Rotas de autenticação como `login` e `register` são gerenciadas aqui. Verifique `src/auth/authRoutes.js` para detalhes).*

---

### Pets (`/api/pets`)

- **`GET /`**
  - **Descrição**: Retorna uma lista de todos os pets.
  - **Acesso**: Público.

- **`GET /:id`**
  - **Descrição**: Retorna os detalhes de um pet específico pelo seu ID.
  - **Acesso**: Público.

- **`POST /`**
  - **Descrição**: Cria um novo pet. Requer envio de `multipart/form-data` para a imagem.
  - **Acesso**: Privado (requer token de Admin).

- **`PUT /:id`**
  - **Descrição**: Atualiza completamente um pet, incluindo a imagem.
  - **Acesso**: Privado (requer token de Admin).

- **`PUT /no-image/:id`**
  - **Descrição**: Atualiza os dados de um pet sem alterar a imagem.
  - **Acesso**: Privado (requer token de Admin).

- **`DELETE /:id`**
  - **Descrição**: Deleta um pet pelo seu ID.
  - **Acesso**: Privado (requer token de Admin).

- **`GET /admin`**
  - **Descrição**: Rota para visualização de pets no painel de administração.
  - **Acesso**: Privado (requer token de Admin).

---

### Adotantes (`/api/adotantes`)

- **`GET /`**
  - **Descrição**: Retorna uma lista de todos os adotantes.
  - **Acesso**: Privado (requer token de Admin).

- **`GET /:id`**
  - **Descrição**: Retorna os detalhes de um adotante específico pelo seu ID.
  - **Acesso**: Privado (requer token de Admin).

- **`POST /`**
  - **Descrição**: Cria um novo adotante.
  - **Acesso**: Privado (requer token de Admin).

- **`PUT /:id`**
  - **Descrição**: Atualiza os dados de um adotante.
  - **Acesso**: Privado (requer token de Admin).

- **`DELETE /:id`**
  - **Descrição**: Deleta um adotante pelo seu ID.
  - **Acesso**: Privado (requer token de Admin).