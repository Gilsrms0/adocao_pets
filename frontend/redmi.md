🐾 Sistema de Adoção de Pets - Frontend
Este repositório contém a interface de usuário (UI) da sua aplicação, construída com React e Vite. Ele consome a API do Backend, gerencia o estado do usuário e fornece a experiência de navegação.

🛠️ Tecnologias Utilizadas
Tecnologia Principal	Descrição
Framework	React
Build Tool	Vite
Requisições HTTP	Axios
Roteamento	React Router DOM
🚀 Configuração e Instalação (Frontend)
Siga estes passos para configurar e rodar o aplicativo web localmente.

1. Pré-requisitos
O Backend deve estar rodando em http://localhost:3001.

Node.js: Versão 18+ (Recomendado: v20+).

npm ou Yarn: Gerenciador de pacotes.

2. Instalação de Dependências
Navegue até o diretório frontend/ (ou a pasta onde se encontra seu código React).

Bash

cd frontend
npm install # ou yarn install
3. Configuração da API (Diretamente no Código)
Como seu projeto não está usando um arquivo .env no Frontend, você deve garantir que a URL base da API esteja configurada corretamente no seu cliente HTTP (Axios).

Localização: Procure o arquivo onde você configura o Axios para ser global (geralmente src/api/axiosConfig.js ou similar).

Ação: Edite o arquivo para definir a URL Base do seu Backend:

JavaScript

// Exemplo: src/api/axiosConfig.js

import axios from 'axios';

// 🚨 Verifique se o Backend está rodando nesta URL
const api = axios.create({
    baseURL: 'http://localhost:3001/api', // <-- A URL da sua API!
});

export default api;
Importante: Se o seu Backend estiver rodando em uma porta ou URL diferente, você deve alterar o valor de baseURL aqui.

4. Execução do Aplicativo
Inicie o servidor de desenvolvimento do Frontend:

Bash

npm run dev
O aplicativo estará acessível em http://localhost:5173.

🔑 Funcionalidades Chave
(O restante das seções de Funcionalidades e Estrutura permanecem as mesmas para descrever a aplicação)

Acesso Geral (Público)
Listagem de Pets: Visualização de todos os pets com status "Disponível".

Detalhes do Pet: Visualização das informações de um pet específico.

Registro de Adotante: Formulário para usuários interessados em adotar.

Acesso de Administrador (ADM)
O acesso ao painel de administrador é liberado após um login bem-sucedido com credenciais ADM. O Token JWT é armazenado e enviado em todas as requisições protegidas.

Dashboard: Painel central para gestão.

Gestão de Pets:

Criação de novos pets com upload de imagem.

Edição de informações e status (disponível, adotado, etc.).

Exclusão de registros.

Gestão de Adotantes:

Visualização da lista completa de adotantes.

Edição e exclusão de cadastros.

💡 Estrutura do Frontend (frontend/src/)
O projeto frontend utiliza uma arquitetura baseada em componentes e rotas:

frontend/src/
├── api/
│   └── axiosConfig.js       # Configuração do Axios (baseURL e JWT interceptor).
├── components/
│   ├── Admin/               # Componentes específicos do painel de administração.
│   ├── Pet/                 # Componentes de listagem e detalhes de pets.
│   └── Shared/              # Componentes reutilizáveis (Header, Footer, etc.).
├── context/
│   └── AuthContext.jsx      # Gerencia o estado de autenticação (usuário, login, logout).
├── pages/
│   ├── AdminDashboard.jsx   # Página principal para usuários ADM.
│   ├── HomePage.jsx         # Página inicial e listagem pública.
│   └── LoginPage.jsx        # Página de login.
└── App.jsx                  # Define o roteamento principal.