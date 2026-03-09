# API de Gerenciamento de Pedidos

API REST desenvolvida com Node.js, Express e PostgreSQL para gerenciamento de pedidos com autenticação JWT.

## Descrição

Essa API fornece endpoints completos para operações CRUD (Create, Read, Update, Delete) de pedidos, com autenticação básica JWT. Desenvolvida seguindo boas práticas de Node.js, com código limpo, organizado e bem documentado.

## Documentação

A documentação da API está disponível via Swagger em:

**http://localhost:3000/api-docs**

Utilizar o botão "Authorize" no Swagger após fazer login para testar os endpoints protegidos.

## Tecnologias Utilizadas

- **Node.js** - JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação com tokens
- **Bcrypt** - Hash de senhas
- **Swagger** - Documentação interativa da API
- **Dotenv** - Gerenciamento de variáveis de ambiente

## Estrutura do Projeto

```
jitterbit/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuração do PostgreSQL
│   │   └── env.js               # Configuração de ambiente
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticação
│   │   └── orderController.js   # Lógica de pedidos
│   ├── middleware/
│   │   └── authMiddleware.js    # Validação JWT
│   ├── models/
│   │   ├── orderModel.js        # Queries de pedidos
│   │   └── userModel.js         # Queries de usuários
│   ├── routes/
│   │   ├── authRoutes.js        # Rotas de autenticação
│   │   └── orderRoutes.js       # Rotas de pedidos
│   ├── utils/
│   │   ├── dataTransform.js     # Transformação de dados
│   │   └── response.js          # Respostas padronizadas
│   └── server.js                # Inicialização do servidor
├── database/
│   ├── schema.sql               # Criação das tabelas
│   └── seed.sql                 # Dados iniciais
├── .env                         # Variáveis de ambiente (não versionado)
├── .env.example                 # Exemplo de configuração
├── .gitignore                   # Arquivos ignorados pelo git
├── package.json                 # Dependências do projeto
└── README.md                    # Descrição do projeto
```

## Pré-requisitos

Instalar antes de iniciar:

- **Node.js** (versão 14 ou superior)
- **npm** (vem com Node.js)
- **PostgreSQL** (versão 12 ou superior)

## Instalação

### 1. Clonar o projeto

```bash
git clone <repository-url>
cd jitterbit
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Criar arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Editar o `.env` e configurar a senha do PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=orders_db

JWT_SECRET=chave_secreta_jwt_aqui
JWT_EXPIRES_IN=24h
```

### 4. Configurar banco de dados PostgreSQL

#### 4.1. Criar o banco de dados

Abrir o terminal PostgreSQL:

```bash
# Se possui usuário postgres:
psql -U postgres

# Ou no macOS/Linux:
psql postgres
```

Criar o banco de dados:

```sql
CREATE DATABASE orders_db;
\q
```

#### 4.2. Executar o schema para criar as tabelas

```bash
psql -d orders_db -f database/schema.sql
```

#### 4.3. Inserir os dados iniciais (usuário de teste)

```bash
psql -d orders_db -f database/seed.sql
```

## Execução

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Ambiente de produção

```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

## Autenticação

A API utiliza autenticação JWT. Para acessar os endpoints de pedidos:

### 1. Login

**Endpoint:** `POST /login`

**Credenciais de teste:**
- Username: `admin`
- Password: `Admin987!`

**Exemplo com curl:**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin987!"
  }'
```

**Resposta:**

```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### 2. Token

Incluir o token no header `Authorization` como `Bearer TOKEN`:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints da API

### Autenticação

#### POST /login
Autentica usuário e retorna token JWT.

### Pedidos (requer autenticação)

#### POST /order
Cria um novo pedido.

**Exemplo:**

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 250.50,
    "items": [
      {
        "idItem": 101,
        "quantidadeItem": 2,
        "valorItem": 75.25
      },
      {
        "idItem": 102,
        "quantidadeItem": 1,
        "valorItem": 100.00
      }
    ]
  }'
```

**Resposta:**

```json
{
  "orderId": "v10089016vdb",
  "value": 250.5,
  "creationDate": "2026-03-09T...",
  "items": [...]
}
```

#### GET /order/list
Lista todos os pedidos.

```bash
curl http://localhost:3000/order/list \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### GET /order/:orderNumber
Busca um pedido específico por número.

```bash
curl http://localhost:3000/order/v10089016vdb \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### PUT /order/:orderNumber
Atualiza um pedido existente.

```bash
curl -X PUT http://localhost:3000/order/v10089016vdb \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "valorTotal": 300.00,
    "items": [
      {
        "idItem": 101,
        "quantidadeItem": 3,
        "valorItem": 100.00
      }
    ]
  }'
```

#### DELETE /order/:orderNumber
Deleta um pedido.

```bash
curl -X DELETE http://localhost:3000/order/v10089016vdb \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Tratamento de Dados

A API transforma os formatos de entrada (português) para saída (inglês):

**Entrada (português):**
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 250.50,
  "items": [
    {
      "idItem": 101,
      "quantidadeItem": 2,
      "valorItem": 75.25
    }
  ]
}
```

**Saída (inglês):**
```json
{
  "orderId": "v10089016vdb",
  "value": 250.50,
  "creationDate": "2026-03-09T...",
  "items": [
    {
      "productId": 101,
      "quantity": 2,
      "price": 75.25
    }
  ]
}
```

**Lógica de ID:** Remove sufixo depois do traço e incrementa o número final.
Exemplo: `v10089015vdb-01` → `v10089016vdb`

## Segurança

- **Senhas:** Hash bcrypt com 10 rounds
- **JWT:** Tokens com expiração configurável (padrão: 24h)
