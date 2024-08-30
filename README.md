# Tarefas+

## Descrição do Projeto

Tarefas+ é um aplicativo de gerenciamento de tarefas desenvolvido com Next.js, TypeScript, Tailwind CSS, react-toast-hot, NextAuth, Firebase e react-icons. O projeto inclui uma funcionalidade de troca de temas (theme switcher) para melhorar a experiência do usuário.

## Demonstração

Confira abaixo uma demonstração do funcionamento do projeto:

[TarefasPlusGif](https://github.com/LeoNzZ7/TarefasPlus/blob/master/tarefas_.gif)

## Deploy

O projeto está disponível online através do seguinte link: https://tarefas-plus-sand.vercel.app/

## Tecnologias Utilizadas

- Next.js com TypeScript
- Tailwind CSS para estilização
- react-toast-hot para notificações
- NextAuth para autenticação
- Firebase para banco de dados e hospedagem
- react-icons para ícones

## Configuração do Ambiente

Para executar este projeto localmente, você precisará configurar as seguintes variáveis de ambiente. Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:

```jsx
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_nextauth_secret

NEXT_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_firebase_measurement_id

NEXT_PUBLIC_URL=http://localhost:3000
```

## Instruções de Configuração

1. Crie um projeto no Google Cloud Console para obter o GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET.
2. Configure um projeto no Firebase Console para obter as credenciais do Firebase.
3. Gere um valor aleatório e seguro para NEXTAUTH_SECRET.
4. Substitua os valores das variáveis no arquivo .env.local pelos seus próprios valores.

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/tarefas-plus.git

# Entre no diretório do projeto
cd tarefas-plus

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Funcionalidades

- Gerenciamento de tarefas
- Autenticação com Google
- Troca de temas (claro/escuro)
- Notificações toast para feedback do usuário

## Contribuição

Contribuições são bem-vindas! Por favor, leia o guia de contribuição para saber como começar.

## Contato

Leonardo Nunes Martinha - [leonardomartinha.dev@gmail.com](mailto:leonardomartinha.dev@gmail.com)

LinkedIn: https://www.linkedin.com/in/leonardo-nunes-martinha/?trk=opento_sprofile_goalscard