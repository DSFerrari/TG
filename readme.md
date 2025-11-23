🎓 Sistema de Avaliação e Acessibilidade de Estabelecimentos
Trabalho de Graduação – Aplicativo Mobile (React Native + Supabase)
📌 Descrição do Projeto

Este projeto é uma aplicação mobile desenvolvida para facilitar o cadastro, consulta e avaliação de estabelecimentos, com foco em acessibilidade, permitindo que usuários encontrem locais adequados às suas necessidades e compartilhem experiências reais.

A aplicação também disponibiliza um painel administrativo, sistema de auditoria completo e notificações em tempo real.

O sistema foi desenvolvido como Trabalho de Graduação (TG), utilizando tecnologias modernas e práticas profissionais.

🎯 Objetivos
Objetivo Geral

Criar um aplicativo acessível para consulta e avaliação de estabelecimentos, permitindo a inclusão de pessoas com diferentes tipos de deficiência no acesso à informação.

Objetivos Específicos

Permitir cadastro e gerenciamento de estabelecimentos.

Coletar avaliações reais de usuários (anônimas ou identificadas).

Registrar acessibilidade dos locais.

Implementar políticas de segurança, auditoria e rastreabilidade.

Criar um fluxo administrativo para aprovar e revisar solicitações.

Oferecer uma experiência inclusiva e adaptada a pessoas com deficiência.

🛠 Tecnologias Utilizadas
Mobile

React Native

Expo

React Navigation

Expo Notifications

React Native Maps

Backend / Infra

Supabase

Supabase Auth (JWT)

PostgreSQL + PostGIS

Supabase Storage

Supabase Realtime

Edge Functions (para notificações push)

Auditoria e Segurança

Row Level Security (RLS)

Triggers SQL

Logs automáticos de ações

Tabela de auditoria imutável

🧩 Arquitetura do Sistema
App React Native (Expo)
       ↓
Supabase Auth — Login / JWT
       ↓
PostgreSQL + PostGIS — Dados geográficos
       ↓
Supabase Storage — Imagens de estabelecimentos
       ↓
Realtime — Atualizações de avaliações
       ↓
Triggers & RLS — Segurança e auditoria
       ↓
Edge Functions — Push Notifications

📱 Funcionalidades
👤 Usuário

Criar conta / login

Buscar estabelecimentos

Filtrar por categoria, distância e acessibilidade

Favoritar estabelecimentos

Avaliar estabelecimentos (nota, título, comentário)

Avaliação anônima opcional

Solicitar exclusão da própria avaliação

Receber notificações push

🏪 Cadastro de Estabelecimento

Nome, categoria, endereço ou GPS

Upload de imagem

Recursos de acessibilidade

Envio para aprovação

🔐 Admin

Ver solicitações pendentes

Aprovar / rejeitar estabelecimentos

Ver pedidos de exclusão de avaliações

Aprovar ou negar pedidos

Fluxo auditável com logs

📋 Auditoria / Logs

Cada ação crítica gera um registro

Tabela imutável com histórico

MONITORAMENTO: criação, edição, exclusão, aprovação etc.

📁 Estrutura de Pastas
src/
 ├─ screens/
 │   ├─ Home/
 │   ├─ Avaliacoes/
 │   ├─ Admin/
 │   └─ CadastrarEstabelecimento/
 ├─ components/
 ├─ contexts/
 ├─ routes/
 ├─ services/
 │   ├─ supabase.js
 │   └─ logs.js
 ├─ utils/
 └─ theme/

🗄 Banco de Dados
Principais tabelas:

profiles

estabelecimentos

avaliacoes

favoritos

logs_app

auditoria_sistema

notificacoes

pedidos_exclusao_avaliacao

estabelecimento_solicitacoes

Views:

estabelecimentos_view

avaliacoes_view

Tabela de Auditoria (exemplo)
create table auditoria_sistema (
  id bigserial primary key,
  tabela text not null,
  operacao text not null,
  registro_id text,
  usuario_id uuid,
  dados_antes jsonb,
  dados_depois jsonb,
  data_criacao timestamp default now()
);

🔒 Políticas de Segurança (RLS)

O projeto utiliza:

RLS ativa nas tabelas críticas

Policies separadas por tabela

Permissões configuradas por usuário

Logs imutáveis

Realtime protegido

Exemplo de policy:

create policy "avaliacoes insert"
on avaliacoes
for insert
to authenticated
with check (auth.uid() = id_usuario);

🧪 Instalação e Execução
Clone o repositório
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

Instale dependências
npm install

Configure o Supabase

Crie um arquivo .env:

EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=chave

Inicie o app
npx expo start

🔄 Builds (EAS)
Android
eas build --platform android

iOS
eas build --platform ios

📤 Próximos Passos

Criar painel web para administradores

Melhorar acessibilidade digital (WCAG)

Implementar fluxo offline-first

Adicionar geofencing para alertas

👤 Autor

Diego Souza Ferrari
Trabalho de Graduação – [Nome do Curso / Universidade]
Email: seu-email
GitHub: seu usuário