# 🗓️ Sistema de Gerenciamento de Eventos Comunitários

Aplicação web para cadastro e gerenciamento de eventos em comunidades locais, como palestras, oficinas, campanhas e reuniões. Cada usuário pode criar seus próprios eventos, adicionar participantes e controlar a lotação máxima de cada evento.

## 🔧 Funcionalidades

### ✅ Autenticação (2 pts)
- Login com e-mail e senha
- Cada usuário logado é considerado um **organizador** de eventos

### 📝 Cadastro de Eventos (4 pts)
- Campos obrigatórios:
  - Título
  - Descrição
  - Data e hora
  - Local
  - Número máximo de participantes
- Funcionalidade de **CRUD completo** (Criar, Ler, Atualizar, Deletar)
- Apenas o organizador pode visualizar e gerenciar os seus próprios eventos

### 👥 Cadastro de Participantes (3 pts)
- Informações solicitadas:
  - Nome
  - E-mail
  - Telefone
- Participante escolhe o evento no momento da inscrição
- O sistema **impede inscrições além do limite de vagas**

### 📋 Listagem de Eventos e Participantes (3 pts)
- Organizadores podem:
  - Visualizar todos os eventos que criaram
  - Ver a lista de participantes de cada evento

### 🎨 Layout Responsivo com Framework CSS (3 pts)
- Interface moderna, responsiva e acessível
- Estilização com [Bootstrap](https://getbootstrap.com/) ou [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript, [Bootstrap]
- **Backend**: Node.js (ou outra stack definida)
- **Banco de Dados**: MySQL 
- **Autenticação**: JWT ou Sessão
- **Outros**: Express

---


## 📸 Demonstração (opcional)





