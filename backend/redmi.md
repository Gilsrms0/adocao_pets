# 🐾 API do Sistema de Adoção de Pets

Esta é a API RESTful para o projeto "Sistema de Adoção de Pets", desenvolvida com Node.js, Express e PostgreSQL. Ela fornece todos os endpoints necessários para gerenciar pets, adotantes e autenticação de usuários.

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

---

## ✨ Funcionalidades da API

-   **Autenticação via JWT:** Geração de tokens para acesso seguro às rotas.
-   **Autorização de Admin:** Proteção de rotas sensíveis, permitindo acesso apenas a administradores.
-   **CRUD de Pets:** Endpoints completos para criar, ler, atualizar e deletar pets.
-   **CRUD de Adotantes:** Endpoints para gerenciar os dados dos adotantes.
-   **Upload de Imagens:** Middleware com `Multer` para processar e salvar imagens dos pets.

---

## 🛠️ Tecnologias Utilizadas

| Componente | Tecnologia | Propósito |
|:---|:---|:---|
| **Servidor** | Node.js (Express) | Criação de API RESTful e gerenciamento de rotas. |
| **Banco de Dados** | PostgreSQL | Armazenamento de dados relacional. |
| **ORM** | Prisma | Mapeamento objeto-relacional e queries seguras. |
| **Autenticação** | JWT, bcryptjs | Geração/verificação de tokens e hash de senhas. |
| **Uploads** | Multer | Processamento de `multipart/form-data` para imagens. |
| **Utilitários** | `dotenv`, `cors`| Gestão de variáveis de ambiente e segurança de requisições. |

---

## 🚀 Configuração e Instalação

Siga estes passos para configurar e executar a aplicação localmente.

### Pré-requisitos

-  **Node.js**: Versão 18+ (Recomendado: v20+).
-  **npm ou Yarn**: Gerenciador de pacotes.
-  **PostgreSQL Server**: Servidor de banco de dados rodando localmente.

### Passo a passo para Instalação

1.  **Clone o Repositório**
    ```bash
    git clone [https://link-para-seu-repositorio.git](https://link-para-seu-repositorio.git)
    cd nome-do-projeto/backend
    ```

2.  **Instale as Dependências**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**

    Crie um arquivo `.env` na raiz da pasta `backend/`. 

  >  [!NOTE]
  > URL de Conexão com o PostgreSQL. Use o exemplo como base e preencha com suas credenciais.

  ```env
    # Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
    DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/pet_adoption_db?schema=public"

    # Chave Secreta do JWT para assinatura de Tokens
    # Gere uma string segura. Ex: openssl rand -base64 32
    JWT_SECRET="SUA_CHAVE_SECRETA_AQUI"

    # Chave Secreta para o Registro de Administrador
    # Use uma string segura diferente para criar usuários ADM via API
    SECRET_ADMIN_KEY="SUA_CHAVE_DE_ADMIN_AQUI"
  ```

4.  **Execute as Migrações do Banco de Dados**

    Este comando irá criar todas as tabelas no seu banco de dados com base no `schema.prisma`.
    ```bash
    npx prisma migrate dev --name init_postgres
    ```

5.  **Crie a Pasta de Uploads**

>  [!IMPORTANT]
> O `MULTER`requer que a pasta de destino exista. Crie-a na raiz do `backend/`:

  A API precisa que a pasta `uploads` exista para salvar as imagens.

  ```bash
    mkdir uploads
  ```

6.  **Inicie o Servidor**
    ```bash
    npm run dev
    ```
    > O servidor estará rodando em `http://localhost:3001`. Você pode agora usar o Insomnia ou Postman para testar as rotas.

---

### 🗺️ Rotas da API

### 🔑 Autenticação (`/api/auth`)

| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | Pública | Cria um novo usuário. Use `adminKey` no body para criar um ADM. |
| `/login` | `POST` | Pública | Autentica o usuário e retorna o JWT. |

### 🐾 Pets (`/api/pets`)

| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Pública | Retorna todos os pets com status 'disponivel'. |
| `/admin` | `GET` | Admin | Retorna todos os pets (qualquer status). |
| `/` | `POST` | Admin | Cadastra um novo pet (requer `image` como `multipart/form-data`). |
| `/:id` | `GET` | Pública | Retorna um pet específico pelo ID. |
| `/:id` | `PUT` | Admin | Atualiza os dados do pet (pode incluir nova imagem). |
| `/data/:id` | `PUT` | Admin | Atualiza os dados do pet sem alterar a imagem. |
| `/:id` | `DELETE` | Admin | Deleta um pet. |

### 🧑 Adotantes (`/api/adotantes`)

| Rota | Método | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Pública | Cadastra um novo adotante. |
| `/` | `GET` | Admin | Retorna todos os adotantes cadastrados. |
| `/:id` | `GET` | Admin | Retorna um adotante específico pelo ID. |
| `/:id` | `PUT` | Admin | Atualiza os dados de um adotante. |
| `/:id` | `DELETE`| Admin | Deleta um adotante. |

---

## 📂 Estrutura do Projeto

O projeto utiliza uma estrutura modular para separar responsabilidades e facilitar a manutenção:

```
backend/
├── prisma/               # Contém o schema e as migrações do banco de dados.
├── src/                  # Diretório principal com todo o código-fonte da aplicação.
│   ├── auth/             # Lógica de autenticação, autorização e middlewares de segurança.
│   │   ├── authController.js
│   │   ├── authMiddleware.js
│   │   └── authRoutes.js
│   │
│   ├── config/           # Arquivos de configuração reutilizáveis.
│   │   ├── paths.js      
│   │   └── upload.js     
│   │
│   ├── controllers/      # Contém a lógica de negócio principal da aplicação.
│   │   ├── adotanteController.js
│   │   └── petController.js
│   │
│   ├── routes/           # Define os endpoints (URLs) da API e os conecta aos controllers.
│   │   ├── adotanteRoutes.js
│   │   └── petRoutes.js
│   │
│   └── server.js         # Ponto de entrada da API, onde o servidor Express é iniciado.
│
├── uploads/              # Pasta onde as imagens dos pets são armazenadas (criada em execução).
└── .env                  # Arquivo para as variáveis de ambiente (credenciais do BD, chaves secretas).
```

---

## 🤝 Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/marcelly-ramos">
        <img src="https://avatars.githubusercontent.com/u/146247134?v=4" width="100px;" alt="Foto de Marcelly no GitHub"/>
        <br />
        <sub><b>Marcelly Ramos</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Gilsrms0">
        <img src="https://avatars.githubusercontent.com/u/136399990?v=4" width="100px;" alt="Foto de Gilson no GitHub"/>
        <br />
        <sub><b>Gilson Ramos</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/santtospereira">
        <img src="https://avatars.githubusercontent.com/u/169617818?v=4" width="100px;" alt="Foto de Camilla no GitHub"/>
        <br />
        <sub><b>Camilla Santos</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="[LINK_DO_GITHUB_AQUI]">
        <img src="[LINK_DO_PERFIL_AQUI]" width="100px;" alt="Foto de Benedito no GitHub"/>
        <br />
        <sub><b>Benedito Rodrigues</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT.


