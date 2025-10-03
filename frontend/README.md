# Frontend - AdoteMe

Este é o frontend do sistema de adoção de pets "AdoteMe". Construído com tecnologias modernas, ele oferece uma interface de usuário rica, performática e totalmente responsiva para conectar pets a novas famílias.

## ✨ Tecnologias Utilizadas

- **React**: Biblioteca para construção de interfaces de usuário.
- **Vite**: Ferramenta de build e servidor de desenvolvimento extremamente rápido.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Tailwind CSS**: Framework de CSS utility-first para estilização rápida e customizável.
- **shadcn/ui**: Coleção de componentes de UI reutilizáveis e acessíveis.
- **TanStack Query (React Query)**: Para gerenciamento de estado assíncrono, cache e sincronização de dados com a API.
- **React Router DOM**: Para roteamento de páginas no lado do cliente.
- **Lucide React**: Pacote de ícones SVG, leves e customizáveis.

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v18+)
- [NPM](https://www.npmjs.com/) ou outro gerenciador de pacotes
- O **Backend do AdoteMe** deve estar configurado e em execução.

## 🚀 Como Começar

1.  **Clone o repositório** e navegue até a pasta do frontend:
    ```bash
    git clone https://github.com/seu-usuario/adocao_pets.git
    cd adocao_pets/frontend
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**

    Crie um arquivo chamado `.env` na raiz do diretório `frontend/` e adicione a seguinte variável, apontando para a URL base onde o backend está rodando.

    ```env
    # .env
    # URL base da API (sem a barra no final)
    VITE_API_URL=http://localhost:3001
    ```

    **Importante**: O valor não deve terminar com `/api`. O prefixo `/api` é adicionado nas chamadas `fetch` dentro do código.

## ▶️ Executando a Aplicação

-   **Modo de Desenvolvimento**: Inicia o servidor de desenvolvimento do Vite com hot-reload.
    ```bash
    npm run dev
    ```
    O site estará disponível em `http://localhost:5173` (ou a próxima porta disponível).

-   **Build para Produção**: Compila e minifica os arquivos para produção.
    ```bash
    npm run build
    ```
    Os arquivos otimizados estarão no diretório `dist/`.

-   **Preview da Build**: Visualiza a versão de produção localmente após o build.
    ```bash
    npm run preview
    ```

## 📂 Estrutura do Projeto

```
frontend/
└── src/
    ├── assets/           # Imagens e fontes
    ├── components/       # Componentes React reutilizáveis
    │   ├── layout/       # Componentes de estrutura (Header, Footer)
    │   └── ui/           # Componentes da biblioteca shadcn/ui
    ├── contexts/         # Contextos React (ex: AuthContext)
    ├── hooks/            # Hooks customizados
    ├── lib/              # Funções utilitárias
    ├── pages/            # Componentes que representam as páginas da aplicação
    │   ├── Index.tsx     # Página inicial
    │   └── Admin...      # Páginas do painel de administração
    ├── types/            # Definições de tipos TypeScript
    ├── App.tsx           # Componente raiz com configuração de rotas
    └── main.tsx          # Ponto de entrada da aplicação React
```
