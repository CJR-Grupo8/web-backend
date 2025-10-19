# 🧰 Projeto Backend – Grupo 8 – Processo Trainee CJR

> Repositório responsável pelo backend da aplicação do grupo 8, voltado ao processo trainee da **CJR**.  
> Tecnologias previstas: **Next.js**, **Nest.js**, **PostgreSQL**
>  
> Este README serve como base inicial — detalhes da lógica da aplicação serão definidos à medida que o projeto evolui.

---

## 📋 Membros do Grupo

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/166563802?v=4" width="120" height="120" style="border-radius:50%;margin:10px;" alt="Guilherme Negreiros"/>
  <img src="https://avatars.githubusercontent.com/u/87036806?v=4" width="120" height="120" style="border-radius:50%;margin:10px;" alt="Luís Cunha"/>
  <img src="https://avatars.githubusercontent.com/u/107566329?v=4" width="120" height="120" style="border-radius:50%;margin:10px;" alt="Leonardo Lopes"/>
  <img src="https://avatars.githubusercontent.com/u/227692461?v=4" width="120" height="120" style="border-radius:50%;margin:10px;" alt="Vinicius"/>
</p>

<p align="center">
  <b>Guilherme Negreiros</b> • 
  <b>Luís Cunha</b> • 
  <b>Leonardo Lopes</b> • 
  <b>Vinicius</b>
</p>

<p align="center">
  <a href="https://github.com/guin409">guin409</a> • 
  <a href="https://github.com/cunha-luiss">cunha-luiss</a> • 
  <a href="https://github.com/Leonardo-LC">Leonardo-LC</a> • 
  <a href="https://github.com/ViniciusA05">ViniciusA05</a>
</p>

---

## 🛠️ Tecnologias

- Next.js 
- Nest.js 
- PostgreSQL

---

## 📦 Como rodar localmente

### 1. Clonar o repositório  
```bash
git clone https://github.com/CJR-Grupo8/web-backend.git
cd web-backend
```

### 2. Instalar dependências  
```bash
npm install
```

### 3. Criar .env local
Criar um .env baseado no molde da .env.example
```bash
cp .env.example .env
```
⚠️ **Importante:** NÃO coloque informações da **.env** dentro do molde **.env.example**, pois esse sim sempre será visível no repositório!

### 3. Rodar servidor
O servidor, após comando abaixo, será inciado em **http://localhost:3001**
```bash
npm run start:dev
```