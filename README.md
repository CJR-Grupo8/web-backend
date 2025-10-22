# 🧰 Projeto Backend – Grupo 8 – Processo Trainee CJR

> Repositório responsável pelo backend da aplicação do grupo 8, voltado ao processo trainee da **CJR**.  
> Tecnologias previstas: **Node.js**, **Next.js**, **PostgreSQL**
>  
> Este README serve como base inicial — detalhes da lógica da aplicação serão definidos à medida que o projeto evolui.

---

## 📋 Membros do Grupo

<table align="center">
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/166563802?v=4" width="150" height="150" style="border-radius:50%;" alt="Guilherme Negreiros"/><br>
      <b>Guilherme Negreiros</b><br>
      <a href="https://github.com/guin409">guin409</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/87036806?v=4" width="150" height="150" style="border-radius:50%;" alt="Luís Cunha"/><br>
      <b>Luís Cunha</b><br>
      <a href="https://github.com/cunha-luiss">cunha-luiss</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/107566329?v=4" width="150" height="150" style="border-radius:50%;" alt="Leonardo Lopes"/><br>
      <b>Leonardo Lopes</b><br>
      <a href="https://github.com/Leonardo-LC">Leonardo-LC</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/227692461?v=4" width="150" height="150" style="border-radius:50%;" alt="Vinicius"/><br>
      <b>Vinicius</b><br>
      <a href="https://github.com/ViniciusA05">ViniciusA05</a>
    </td>
  </tr>
</table>

---

## 🛠️ Tecnologias

- Node.js 
- Next.js 
- PostgreSQL

---

## 📦 Como rodar localmente

### 1. Clonar o repositório  
```bash
git clone https://github.com/CJR-Grupo8/web-backend.git
cd web-backend
```

### 2. Instalar dependências 
Instale o Node (v.20+)
```bash
npm install
```
Instale o PostgreSQL e crie o banco:
```sql
   CREATE DATABASE web_backend;
```

### 3. Criar .env local
Criar um .env baseado no molde da .env.example
> Substitua com sua senha do PostgreSQL

>⚠️ **Importante:** NÃO coloque informações da **.env** dentro do molde **.env.example**, pois esse sim sempre será visível no repositório!

### 4. Rodar servidor
O servidor, após comando abaixo, será inciado em **http://localhost:3001**
```bash
npm run start:dev
```