// Arquivo README.md para o projeto SecureYield

# SecureYield - Automatizador de Operações Financeiras

Este projeto é um TCC que implementa um automatizador de operações financeiras no mercado de renda fixa secundária. O sistema permite que usuários iniciem automações Playwright a partir de uma interface web, facilitando o processo de investimento.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Backend (Fastify + TypeScript)
- Sistema de autenticação (registro, login, verificação de token)
- Rotas para gerenciamento de usuários
- Rotas para automação financeira
- Integração com MongoDB Atlas
- Suporte para Cloudflare R2

### Frontend (Next.js + ShadCN UI)
- Página inicial atrativa
- Sistema de login e registro
- Dashboard com o botão "Invista Já"
- Página de status para acompanhar a automação

## Tecnologias Utilizadas

- **Backend**: Fastify, TypeScript, MongoDB
- **Frontend**: Next.js, ShadCN UI, TailwindCSS
- **Automação**: Playwright
- **Banco de Dados**: MongoDB Atlas (Free Tier)
- **Armazenamento**: Cloudflare R2 (Free Tier)

## Como Executar o Projeto

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn
- MongoDB Atlas (conta gratuita)
- Cloudflare R2 (opcional)

### Configuração do Backend
1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```
PORT=3001
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=seu_segredo_jwt
NODE_ENV=development
```

4. Inicie o servidor:
```bash
npm run dev
```

### Configuração do Frontend
1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_segredo_nextauth
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Fluxo de Funcionamento

1. O usuário acessa o site e cria uma conta ou faz login
2. No dashboard, o usuário clica no botão "Invista Já"
3. O sistema inicia a automação Playwright que:
   - Abre o portal BTG Pactual
   - Aguarda login manual do usuário
   - Navega para a página de investimentos
   - Interage com filtros e extrai dados
   - Executa a operação de investimento

## Estrutura de Diretórios

```
secureyield/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── plugins/
│   │   ├── services/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   │   ├── automation/
    │   │   └── storage/
    │   └── ...
    ├── .env.local
    └── package.json
```

## Contribuição

Este projeto foi desenvolvido como parte de um TCC. Contribuições são bem-vindas através de pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.
