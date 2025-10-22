# 🚀 Web Backend - API REST com NestJS e Prisma

API REST completa com CRUD de usuários e posts, usando NestJS, Prisma ORM e PostgreSQL.

## 📋 Funcionalidades

- ✅ CRUD completo de Usuários (com hash de senha)
- ✅ CRUD completo de Posts
- ✅ Validação de dados com class-validator
- ✅ Docker e Docker Compose
- ✅ PostgreSQL com Prisma ORM
- ✅ TypeScript

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **TypeScript** - Linguagem
- **Docker** - Containerização
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de DTOs

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd web-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 4. Inicie o banco de dados com Docker

```bash
docker-compose up -d postgres
```

### 5. Execute as migrações do Prisma

```bash
npx prisma migrate dev --name update_user_model
```

### 6. Inicie a aplicação

```bash
npm run start:dev
```

A API estará disponível em: `http://localhost:3001`

## 🐳 Docker

### Executar tudo com Docker Compose

```bash
docker-compose up --build
```

Isso irá:
- Criar o container do PostgreSQL
- Criar o container da aplicação
- Executar as migrações automaticamente
- Iniciar a API na porta 3001

## 📚 Endpoints da API

### Health Check

```http
GET /health
```

### Usuários (Users)

#### Criar usuário
```http
POST /users
Content-Type: application/json

{
  "fullName": "João Silva",
  "username": "joaosilva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### Listar todos os usuários
```http
GET /users
```

#### Buscar usuário por ID
```http
GET /users/:id
```

#### Atualizar usuário
```http
PATCH /users/:id
Content-Type: application/json

{
  "fullName": "João Pedro Silva",
  "email": "joaopedro@example.com"
}
```

#### Deletar usuário
```http
DELETE /users/:id
```

### Posts

#### Criar post
```http
POST /posts
Content-Type: application/json

{
  "title": "Meu primeiro post",
  "content": "Conteúdo do post",
  "published": false,
  "authorId": 1
}
```

#### Listar todos os posts
```http
GET /posts
```

#### Buscar post por ID
```http
GET /posts/:id
```

#### Buscar posts por autor
```http
GET /posts/author/:authorId
```

#### Atualizar post
```http
PATCH /posts/:id
Content-Type: application/json

{
  "title": "Título atualizado",
  "published": true
}
```

#### Deletar post
```http
DELETE /posts/:id
```

## 🗄️ Modelo de Dados

### User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  fullName  String
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}
```

### Post
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

## 🧪 Testando a API

### Com cURL

```bash
# Criar usuário
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva",
    "username": "joaosilva",
    "email": "joao@example.com",
    "password": "senha123"
  }'

# Listar usuários
curl http://localhost:3001/users

# Criar post
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu primeiro post",
    "content": "Conteúdo do post",
    "authorId": 1
  }'

# Listar posts
curl http://localhost:3001/posts
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Build para produção
npm run build

# Executar produção
npm run start:prod

# Gerar Prisma Client
npx prisma generate

# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações
npx prisma migrate deploy

# Abrir Prisma Studio (UI do banco)
npx prisma studio
```

## 🔒 Segurança

- Senhas são automaticamente hasheadas com bcrypt (10 rounds)
- Senhas nunca são retornadas nas respostas da API
- Validação de dados em todos os endpoints
- Email e username são únicos no banco de dados

## 📂 Estrutura do Projeto

```
web-backend/
├── src/
│   ├── main.ts              # Ponto de entrada
│   ├── app.module.ts        # Módulo principal
│   ├── prisma/              # Serviço Prisma
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── users/               # Módulo de usuários
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   └── posts/               # Módulo de posts
│       ├── posts.controller.ts
│       ├── posts.service.ts
│       ├── posts.module.ts
│       └── dto/
│           ├── create-post.dto.ts
│           └── update-post.dto.ts
├── prisma/
│   └── schema.prisma        # Schema do banco
├── docker-compose.yml       # Docker Compose
├── Dockerfile               # Dockerfile
└── package.json
```

## 🚧 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar paginação nos endpoints de listagem
- [ ] Implementar upload de imagens
- [ ] Adicionar testes unitários e E2E
- [ ] Implementar cache com Redis
- [ ] Adicionar documentação Swagger/OpenAPI

## 📄 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.

## 👨‍💻 Autor

cunha-luiss

---

Feito com ❤️ usando NestJS e Prisma
