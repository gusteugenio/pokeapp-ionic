<h1 align="center">📱 Pokedex App</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif" alt="Pikachu" width="120" />
</p>

<p align="center">
  Uma aplicação moderna construída com <strong>Ionic</strong> + <strong>Angular</strong> consumindo a <a href="https://pokeapi.co" target="_blank">PokeAPI</a> para explorar, capturar e gerenciar Pokémons — diretamente do seu navegador!<br />
  <a href="https://pokeapp-ionic-frontend.vercel.app/">🚀 Acesse a versão online aqui</a>
</p>

---

## 🚀 Deploy

O projeto está disponível em produção com deploys separados para frontend e backend:

- Frontend hospedado no **Vercel**  
- Backend hospedado no **Render**  

### Branches do repositório

- A branch `main` é focada no desenvolvimento local, testes e atualizações para desenvolvimento
- A branch `prod` contém o código para deploy e produção, usada para builds no Vercel (frontend) e Render (backend)

---

## 🔧 Tecnologias Utilizadas

<div align="center">

![Ionic](https://img.shields.io/badge/Ionic-3880ff?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-ff6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logoColor=white)

</div>

---

## ✨ Destaques do Projeto

- 🔐 Sistema de autenticação com JWT
- 👤 Cadastro e login com persistência de usuário
- 🔁 Paginação e busca dinâmica de Pokémons
- ⭐ Favoritar (capturar) Pokémons com sincronização backend
- 📊 Tela de detalhes com gráfico via Chart.js
- 🧠 Área do Treinador com sistema de níveis e badges
- 🐳 Ambiente integrado com Docker (frontend, backend e webhook)
- 🧪 Testes unitários com cobertura de funcionalidades-chave
- 🔗 Webhooks para eventos de captura e progresso de nível
- 🌐 Deploy contínuo via Vercel e Render

---

## 📦 Estrutura e Arquitetura

- **Frontend em Ionic + Angular**
- **Backend em Node.js + Express + Mongoose + JWT**
- **Models bem definidos com TypeScript**
- **Services reativos com RxJS**
- **Dockerfile separado para frontend e backend**
- **Variáveis de ambiente via `.env` para o backend**

---

## 🖥️ Backend

O backend é desenvolvido em **Node.js** com **Express**, utilizando **MongoDB** para persistência e **JWT** para autenticação.  

Ele é hospedado de forma independente no Render, possibilitando escalabilidade e isolamento. 

Sua principal responsabilidade é gerenciar autenticação, favoritos, informações do treinador, e sincronização de dados entre frontend e banco.  

API base: https://pokeapp-ionic-backend.onrender.com

---

## 🚀 Executando o Projeto

### 🔹 1. Clone o repositório

```bash
git clone https://github.com/gusteugenio/pokeapp-ionic.git
cd pokeapp-ionic
```

### 🔹 2. Usando Docker (Recomendado)

Antes de subir o ambiente, rode:

```bash
npm install
```

Depois, execute:

```bash
docker-compose up --build
```

A aplicação estará disponível em: [http://localhost:8100](http://localhost:8100)

### 🔹 3. Manualmente (sem Docker)

```bash
npm install
npm run start-app
```

Ou para rodar com logs (frontend + backend + webhook):

```bash
npm install
npm run start-log
```

Isso executará três serviços em paralelo com `concurrently`:  
- O frontend (via `ionic serve`)  
- O backend com autenticação (via `node auth-backend/server.js`)
- O backend com logs (via `node backend/server.js`)


### 🔸 Importante: configurar o `.env`

Para que o backend funcione corretamente, no arquivo `.env.example` (localizado na pasta `auth-backend`) preencha os seguintes campos:

```env
MONGO_URI=
JWT_SECRET=
```

#### Como obter:

- **MONGO_URI**: Crie um cluster gratuito no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) e copie a string de conexão.
- **JWT_SECRET**: Defina qualquer string segura para ser usada como chave de autenticação (ex: `minha_chave_super_segura`).

#### Exemplo:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=minha_chave_super_segura
```

---

## 📡 Webhooks

O projeto envia eventos para um servidor backend (Express) sempre que um Pokémon for favoritado/desfavoritado ou o treinador mudar de nível.

### Como usar os webhooks localmente


1. **Descomente a variável `webhookUrl` e as linhas com `this.http.post(this.webhookUrl, ...)` nos arquivos `favorite.service.ts` e `trainer.service.ts`**.
3. Caso esteja utilizando o Docker, **descomente a chamada para a imagem do serviço backend no arquivo `docker-compose.yml`**.
2. Certifique-se de que o backend está rodando (via Docker ou `npm run start-log`).
3. O arquivo `backend/logs.txt` será gerado e atualizado automaticamente com mensagens formatadas, como:


```
O treinador Gustavo aumentou o nível: 1 → 2
Pokémon pikachu foi favoritado pelo treinador Gustavo

```

### Exemplo de payload enviado:

```ts
this.http.post(this.webhookUrl, {
  event: 'favorited',
  pokemon: name,
  trainerName: this.trainerService.getTrainerName(),
  trainerGender: this.trainerService.getTrainerGender()
}).subscribe();
```

Os logs são salvos em `backend/logs.txt`.

---

## 🧪 Testes Unitários
Testes garantem que funcionalidades-chave, como o sistema de favoritos, funcionem corretamente e que mudanças futuras não quebrem o app. Por isso, todos os devidos testes unitários foram criados.

```ts
it('should retrieve pokemon species by name', () => {
  const mockSpecies: PokemonSpecies = {
    flavor_text_entries: [
      {
        flavor_text: "Quando exposto ao calor, ele armazena energia elétrica nas bochechas.",
      }
    ],
    language: { name: 'en' }
  };
  const name = 'pikachu';

  service.getPokemonSpecies(name).subscribe(species => {
    expect(species).toEqual(mockSpecies);
  });

  const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  expect(req.request.method).toBe('GET');
  req.flush(mockSpecies);
});
```

---

## 🏆 Área do Treinador

> Uma experiência gamificada no estilo Pokémon para o usuário.

- 👤 Avatar personalizado de acordo com gênero (Ash ou Serena)
- 🧱 Progressão com níveis a cada 5 capturas
- 🏅 Sistema de Badges por progresso (bronze, prata, ouro)
- 📈 Barra de progresso visual e motivação personalizada
- 🎯 Nível máximo: 50

---

## 📊 Gráfico de Atributos

Na página de detalhes, os status do Pokémon são exibidos visualmente com cores personalizadas de acordo com o tipo.

---

## 🖼️ GIFs de Demonstração

Confira os GIFs da aplicação na pasta [`src/assets/gifs`](https://github.com/gusteugenio/pokeapp-ionic/tree/main/src/assets/gifs), demonstrando:

- Fluxo de registro e login com validação de credenciais
- Paginação da lista de Pokémons
- Filtragem por tipos
- Busca de Pokémon
- Tela de detalhes de um Pokémon
- Tela de capturados
- Área do Treinador e sistema de níveis

---

## 📬 Contato

📧 Email: [gustavoeugenio297@gmail.com](mailto:gustavoeugenio297@gmail.com)  
🐙 GitHub: [gusteugenio](https://github.com/gusteugenio)

---

<p align="center"><strong>Feito com 💙 por um fã de Pokémon e da arte de programar!</strong></p>
