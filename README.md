# BACKEND:
.NET Back-End project for UBS Trainee Program - Group 2
## 🐳 Comandos Docker - UBS Watchdog

### 🚀 Desenvolvimento Local (sem Docker)

#### Subir apenas o PostgreSQL
```bash
docker-compose up -d postgres
```

#### Rodar a API localmente
```bash
cd UBS.Watchdog.API
dotnet run
```

Acesse: `http://localhost:5000/swagger`

---

### 🐋 Rodar tudo no Docker

#### 1. Build e Start (primeira vez)
```bash
docker-compose up --build -d
```

#### 2. Apenas Start (builds já feitos)
```bash
docker-compose up -d
```

#### 3. Ver logs
```bash
# Logs de todos os containers
docker-compose logs -f

# Logs apenas da API
docker-compose logs -f ubs-watchdog-api

# Logs apenas do Postgres
docker-compose logs -f postgres
```

#### 4. Parar containers
```bash
docker-compose down
```

#### 5. Parar e limpar volumes (⚠️ APAGA DADOS!)
```bash
docker-compose down -v
```

---

## 🔍 Verificar Status

### Listar containers rodando
```bash
docker-compose ps
```

### Entrar no container da API
```bash
docker exec -it ubs-watchdog-api bash
```

### Entrar no PostgreSQL
```bash
docker exec -it ubs-watchdog-postgres psql -U docker_user -d ubs_watchdog
```

---

## 🛠️ Troubleshooting

### Erro: "port is already allocated"
```bash
# Ver o que está usando a porta
sudo lsof -i :6000
sudo lsof -i :6001

# Matar processo
kill -9 <PID>
```

### Rebuild forçado (após mudanças no código)
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Ver uso de disco do Docker
```bash
docker system df
```

### Limpar tudo (containers, imagens, volumes não usados)
```bash
docker system prune -a --volumes
```

### Verificar health do Postgres
```bash
docker inspect ubs-watchdog-postgres | grep -A 10 Health
```

---

## 📊 Endpoints após subir

### Swagger (API)
```
http://localhost:6001
```

### Health Check
```bash
curl http://localhost:6001/api/health
```
---

## 🔄 Workflow Típico

### Desenvolvimento
```bash
# 1. Subir só o banco
docker-compose up -d postgres

# 2. Rodar API localmente (hot reload)
cd UBS.Watchdog.API
dotnet watch run

# 3. Fazer alterações no código

# 4. Testar no Swagger: http://localhost:5000
```

### deploy completo
```bash
# 1. Build e subir tudo
docker-compose up --build -d

# 2. Ver logs
docker-compose logs -f

# 3. Testar: http://localhost:6001

# 4. Parar
docker-compose down
```

---

# FRONTEND:

## Como rodar em DEV

Para rodar o projeto em desenvolvimento (dev), instale as dependências e suba o servidor local. 

No diretório do projeto, execute:
```bash
npm install
# (ou yarn, pnpm, bun) 
```

E depois inicie com:
```bash
npm run dev
# (ou yarn, pnpm, bun)
```

A aplicação ficará disponível em http://localhost:3000 e atualiza automaticamente conforme os arquivos são editados.

## Deploy

No deploy, a aplicação está publicada na Vercel e pode ser acessada em https://ubs-watchdog-frontend-group2.vercel.app/. 
