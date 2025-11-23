# MAI – Mapa da Acessibilidade Inclusiva

Aplicativo mobile desenvolvido em **React Native (Expo)** com backend em **Supabase** e banco **PostgreSQL + PostGIS**.  
O objetivo é mapear e catalogar estabelecimentos com informações de acessibilidade, permitindo que usuários encontrem locais inclusivos e contribuam com avaliações.

---

## Sumário
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Banco de Dados](#banco-de-dados)
- [Acessibilidade](#acessibilidade)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Licença](#licença)

---

## Sobre o Projeto

O **MAI** é um aplicativo focado em acessibilidade e inclusão, permitindo que pessoas encontrem estabelecimentos acessíveis, avaliem locais e contribuam para uma base colaborativa.  
Inclui também um **painel administrativo** para aprovação de cadastros, gerenciamento de usuários e controle de solicitações.

---

## Funcionalidades

### Usuário
- Cadastro, login e recuperação de senha
- Cadastrar estabelecimentos com fotos, localização e recursos de acessibilidade
- Listagem com filtros (categoria, distância, avaliação, recursos)
- Favoritar estabelecimentos
- Escrever avaliações (0 a 5, com título, comentário e opção anônima)
- Ver localização em mapa
- Acompanhar solicitações de edição e exclusão
- Aceitar Termo de Consentimento (registrado no Supabase)

### Administrador
- Aprovar ou rejeitar novos estabelecimentos
- Aprovar ou rejeitar pedidos de exclusão/edição
- Gerenciar usuários
- Excluir estabelecimentos (com fotos e favoritos)
- Painel administrativo com telas dedicadas

---

## Arquitetura

### Frontend (Expo)
- React Native com Componentização
- Context API para gerenciamento de estado
- React Navigation (Stack, Tabs e Drawer)
- Expo Location para permissões e coleta de posição
- React Native Maps

### Backend (Supabase)
- Supabase Auth  
- Supabase Storage (imagens)
- Postgres com PostGIS
- Policies (RLS) restritas por usuário e permissões admin
- Views otimizadas com extração de latitude/longitude

---

## Banco de Dados

### Tabelas Principais
- **profiles**
  - `id`, `email`, `nome`, `is_admin`, `data_aceite_termos`
- **estabelecimentos**
  - `id`, `nome`, `categoria`, `acessibilidade[]`, `status`, `localizacao (geography)`, `descricao`, `fotos[]`
- **avaliacoes**
  - Nota (0–5), título, comentário, anonímia, vínculo ao usuário
- **favoritos**
- **solicitacoes_edicao**
- **solicitacoes_exclusao**

### Views
- **estabelecimentos_view**  
  Inclui lat/long processados, status e dados completos para consumo no app.

### Policies (RLS)
- Somente administradores podem aprovar/rejeitar estabelecimentos
- Usuários só alteram dados próprios
- Avaliações e favoritos isolados por user_id
- Solicitações vinculadas ao criador
- Leitura pública apenas para estabelecimentos aprovados

---

## Acessibilidade

O app segue boas práticas:
- Labels e acessibilidade para leitores de tela
- Áreas de toque adequadas
- Alto contraste
- Texto dinâmico
- Navegação clara
- Descrições completas para botões e ícones

---

## Instalação

Clone o repositório:

```sh
git clone https://github.com/SEU_USUARIO/MAI.git
cd MAI
Instale as dependências:

sh
Copiar código
npm install
Execute o projeto:

sh
Copiar código
npx expo start
Variáveis de Ambiente
Crie um arquivo .env na raiz:

env
Copiar código
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
Scripts
sh
Copiar código
npm start       # Iniciar no Expo
npm run android
npm run ios
npm run web
npm run lint
Licença
Este projeto é parte de um Trabalho de Graduação (TG).

Autor
Diego Souza Ferrari
Isabela Bueno Silva
Aplicativo desenvolvido para fins acadêmicos.