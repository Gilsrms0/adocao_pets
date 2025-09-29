🐾 Sistema de Adoção de Pets (Full-Stack)
Este projeto é uma plataforma completa para gerenciar adoções de pets, com um Backend robusto em Node.js/Express (com PostgreSQL) e um Frontend moderno em React/Vite.

🛠️ Tecnologias Utilizadas
Componente	Tecnologia Principal	Descrição
Backend (API)	Node.js (Express)	Servidor RESTful que gerencia dados, autenticação e uploads.
Banco de Dados	PostgreSQL	BD relacional de alta performance.
ORM	Prisma	Gerencia o esquema e as consultas do BD.
Frontend (UI)	React (Vite)	Interface de usuário moderna e rápida.
Autenticação	JWT, bcryptjs	Segura o acesso às rotas de administrador.
Arquivos	Multer	Gerenciamento de upload de imagens.
🚀 Configuração e Instalação
Siga estes passos para configurar e executar a aplicação localmente.

1. Pré-requisitos
Node.js: Versão 18+ (Recomendado: v20+).
TailwindCSS

npm: Gerenciador de pacotes.

PostgreSQL Server: Servidor rodando localmente (necessário para o DATABASE_URL).

2. Configuração do Backend (/backend)
Navegue até o diretório backend/.

Bash

cd backend
a. Instalação de Dependências

Bash

npm install # ou yarn install
b. Variáveis de Ambiente (.env)

Crie o arquivo .env na raiz do diretório backend/ e adicione suas credenciais do PostgreSQL:

Snippet de código

# 🚨 Adapte este campo com suas credenciais do PostgreSQL
# Exemplo: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="postgresql://user_postgres:minhasenha@localhost:5432/pet_adoption_db?schema=public" 

# Chave Secreta do JWT
JWT_SECRET="SEGREDO_SUPER_SECRETO" 

# Chave de Registro de Administrador
SECRET_ADMIN_KEY="sua_chave_secreta_aqui"
c. Migração do Prisma (Criação de Tabelas)

Execute a migração para criar as tabelas no PostgreSQL:

Bash

npx prisma migrate dev --name init_postgres
d. Inicialização da Pasta de Uploads

Crie a pasta de armazenamento de imagens. Esta pasta é obrigatória para o Multer:

Bash

mkdir uploads
e. Execução do Servidor

Inicie o servidor de desenvolvimento:

Bash

npm run dev 
O Backend (API) estará rodando em http://localhost:3001.

3. Configuração do Frontend (/frontend)
Navegue até o diretório do frontend (ex: frontend/).

Bash

cd ../frontend 
a. Instalação de Dependências

Bash

npm install # ou yarn install
b. Variáveis de Ambiente do Frontend (.env.local)

Crie um arquivo .env.local na raiz do frontend para apontar para a API:

Snippet de código

VITE_API_URL=http://localhost:3001/api
c. Execução do Aplicativo

Inicie o aplicativo React:

Bash

npm run dev
O Frontend estará acessível em http://localhost:5173.

🗺️ Rotas da API
🔑 Rotas de Autenticação (/api/auth)
Rota	Método	Proteção	Descrição
/api/auth/register	POST	Pública	Cria um novo usuário. Use adminKey para criar um ADM.
/api/auth/login	POST	Pública	Autentica o usuário e retorna o JWT.
🐾 Rotas de Pets (/api/pets)
Rota	Método	Proteção	Descrição
/api/pets	GET	Pública	Retorna todos os pets com status: 'disponivel'.
/api/pets/admin	GET	ADM	Retorna todos os pets (disponíveis, adotados, etc.).
/api/pets	POST	ADM	Cadastra um novo pet (requer image como multipart/form-data).
/api/pets/:id	GET	Pública	Retorna um pet específico pelo ID.
/api/pets/:id	PUT	ADM	Atualiza os dados do pet (pode incluir nova imagem).
/api/pets/data/:id	PUT	ADM	Atualiza os dados do pet sem alterar a imagem.
/api/pets/:id	DELETE	ADM	Deleta um pet.
🧑 Rotas de Adotantes (/api/adotantes)
Rota	Método	Proteção	Descrição
/api/adotantes	POST	Pública	Cadastra um novo adotante.
/api/adotantes	GET	ADM	Retorna todos os adotantes cadastrados.
/api/adotantes/:id	GET	ADM	Retorna um adotante específico pelo ID.
/api/adotantes/:id	PUT	ADM	Atualiza os dados de um adotante.
/api/adotantes/:id	DELETE	ADM	Deleta um adotante.
💡 Estrutura do Backend (backend/src/)
O projeto backend utiliza uma estrutura modular para separar responsabilidades:

backend/src/
├── auth/
│   ├── authController.js    
│   ├── authMiddleware.js    
│   └── authRoutes.js        
├── config/
│   └── paths.js             # Módulo de configuração de caminhos absolutos (crucial para o Multer).
├── controllers/
│   ├── adotanteController.js
│   └── petController.js     
├── routes/
│   ├── adotanteRoutes.js    
│   └── petRoutes.js         
└── server.js                # Inicialização e middlewares globais.
📝 Licença
Este projeto está licenciado sob a licença [MIT / Insira sua Licença Aqui].



faca primeiro so o back end o redmi



Sem problemas! Aqui está o arquivo README.md focado apenas no Backend do seu Sistema de Adoção de Pets, incluindo as instruções para a configuração com PostgreSQL e as rotas.

🐾 Sistema de Adoção de Pets - Backend
Este repositório contém a API RESTful que serve como o coração do seu sistema de adoção de pets. Ele gerencia dados de pets, adotantes, autenticação de usuários e o upload de imagens.

🛠️ Tecnologias Utilizadas
Componente	Tecnologia Principal	Descrição
Linguagem	Node.js (Express)	Servidor rápido e escalável.
Banco de Dados	PostgreSQL	BD relacional de alta performance.
ORM	Prisma	Gerenciamento de esquema e consultas SQL.
Autenticação	JWT, bcryptjs	Segura o acesso às rotas de administrador.
Uploads	Multer	Middleware para processamento de multipart/form-data (imagens).
🚀 Configuração e Instalação (Backend)
Siga estes passos para configurar e executar a API localmente.

1. Pré-requisitos
Node.js: Versão 18+ (Recomendado: v20+).

npm ou Yarn: Gerenciador de pacotes.

PostgreSQL Server: Servidor rodando localmente e acessível.

2. Configuração do Banco de Dados
Crie um Banco de Dados Vazio no seu servidor PostgreSQL. Exemplo: pet_adoption_db.

Obtenha suas Credenciais (Usuário, Senha, Host e Porta).

3. Instalação e Ambiente
Navegue até o diretório backend/.

a. Instalação de Dependências

Bash

npm install # ou yarn install
b. Variáveis de Ambiente (.env)

Crie o arquivo .env na raiz do diretório backend/ com as seguintes variáveis. Atenção: Adapte a DATABASE_URL com suas credenciais do PostgreSQL.

Snippet de código

# 🚨 URL de Conexão com o PostgreSQL
# Exemplo: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="postgresql://user_postgres:minhasenha@localhost:5432/pet_adoption_db?schema=public" 

# Chave Secreta do JWT para Assinatura de Tokens
JWT_SECRET="SEGREDO_SUPER_SECRETO" 

# Chave Secreta para o Registro de Administrador
SECRET_ADMIN_KEY="sua_chave_secreta_aqui"
c. Migração do Prisma (Criação de Tabelas)

Aplique o esquema definido no seu arquivo schema.prisma ao banco de dados:

Bash

npx prisma migrate dev --name init_postgres
d. Inicialização da Pasta de Uploads (CRÍTICO)

O Multer requer que a pasta de destino exista. Crie-a manualmente na raiz do backend/:

Bash

mkdir uploads
4. Execução do Servidor
Inicie a API em modo de desenvolvimento:

Bash

npm run dev 
O Backend (API) estará rodando em http://localhost:3001.

🗺️ Rotas da API
Todas as rotas são prefixadas por /api.

🔑 Rotas de Autenticação (/api/auth)

Rota	Método	Descrição

/api/auth/register	POST	Cria um novo usuário (ADOTANTE). Inclua adminKey para criar um ADM.
/api/auth/login	POST	Autentica o usuário e retorna o JWT.

🐾 Rotas de Pets (/api/pets)

As rotas marcadas como (ADM) requerem o envio de um token JWT válido no cabeçalho Authorization: Bearer <token>.

Rota	Método	Proteção	Descrição

/api/pets	GET	Pública	Lista pets com status: 'disponivel'.
/api/pets/admin	GET	ADM	Lista todos os pets (disponíveis e adotados).

/api/pets	POST	ADM	Cadastra novo pet (requer image como multipart/form-data).

/api/pets/:id	GET	Pública	Busca um pet específico pelo ID.

/api/pets/:id	PUT	ADM	Atualiza dados e imagem do pet.

/api/pets/data/:id	PUT	ADM	Atualiza dados do pet sem alterar a imagem.

/api/pets/:id	DELETE	ADM	Deleta um pet.
🧑 Rotas de Adotantes (/api/adotantes)

Rota	Método	Proteção	Descrição
/api/adotantes	POST	Pública	Cadastra um novo adotante.
/api/adotantes	GET	ADM	Lista todos os adotantes.
/api/adotantes/:id	GET	ADM	Busca adotante pelo ID.

💡 Estrutura e Organização (backend/src/)
O projeto utiliza uma estrutura modular, com destaque para o módulo de configuração de caminhos (paths.js), que resolveu problemas de inicialização e Multer:

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