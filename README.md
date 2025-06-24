
<h1 align="center">📱 Pokedex App</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif" alt="Pikachu" width="120" />
</p>

<p align="center">
  Uma aplicação moderna construída com <strong>Ionic</strong> + <strong>Angular</strong> consumindo a <a href="https://pokeapi.co" target="_blank">PokeAPI</a> para explorar, capturar e gerenciar Pokémons — diretamente do seu navegador!<br />
  <a href="https://gusteugenio.github.io/pokeapp-ionic/">🚀 Acesse a versão online aqui</a>
</p>

---

## 🔧 Tecnologias Utilizadas

<div align="center">

![Ionic](https://img.shields.io/badge/Ionic-3880ff?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-ff6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?style=for-the-badge&logo=github&logoColor=white)

</div>

---

## ✨ Destaques do Projeto

- 🔁 Paginação e busca dinâmica de Pokémons
- ⭐ Favoritar (capturar) Pokémons com armazenamento local
- 📊 Tela de detalhes com gráfico de status via Chart.js
- 🧠 Área do Treinador com sistema de níveis, badges e progresso
- 🌐 Deploy contínuo via GitHub Pages
- 🧪 Testes unitários para funcionalidades chave
- 🔗 Integração com Webhooks para eventos de favoritar/desfavoritar
- 🐳 Ambiente pronto para Docker

---

## 📦 Estrutura e Arquitetura

- **Componentização inteligente**: cada tela é isolada e independente
- **Services com responsabilidades claras**: comunicação com API, gestão de favoritos e progresso do treinador
- **Reatividade com RxJS**: Subject e BehaviorSubject usados para refletir atualizações em tempo real
- **Chamadas assíncronas paralelas** com `forkJoin` para performance
- **Separação de models** para melhor tipagem com TypeScript

---

## 🧪 Testes Unitários (Exemplo)

```ts
it('should toggle favorite: remove if already favorite', () => {
  service.addFavorite('pikachu');
  const reqAdd = httpMock.expectOne(service['webhookUrl']);
  reqAdd.flush({});

  service.toggleFavorite('pikachu');
  expect(service.isFavorite('pikachu')).toBeFalse();

  const reqRemove = httpMock.expectOne(service['webhookUrl']);
  expect(reqRemove.request.body.event).toBe('unfavorited');
  reqRemove.flush({});
});
```

---

## 🚀 Executando o Projeto

### 🔹 1. Clone o repositório

```bash
git clone https://github.com/gusteugenio/pokeapp-ionic.git
cd pokeapp-ionic
```

### 🔹 2. Usando Docker (Recomendado)

```bash
docker-compose up --build
```


### 🔹 3. Manualmente (sem Docker)

```bash
npm install
ionic serve
```

Acesse [http://localhost:8100](http://localhost:8100)


---

## 🏆 Área do Treinador

> Uma experiência gamificada no estilo Pokémon para o usuário

- 👤 Escolha de nome e gênero (Ash ou Serena)
- 🧱 Progressão com níveis a cada 5 capturas
- 🏅 Sistema de Badges por progresso (bronze, prata, ouro)
- 📈 Barra de progresso visual e motivação personalizada
- 🎯 Nível máximo: 50

---

## 📊 Gráfico de Atributos

Na página de detalhes, os status do Pokémon são exibidos visualmente com cores personalizadas de acordo com o tipo.

---

## 📡 Webhooks

Ao favoritar/desfavoritar um Pokémon, um evento é disparado para um endpoint externo via `HttpClient`:

```ts
this.http.post(this.webhookUrl, {
  pokemon: name,
  event: 'favorited' | 'unfavorited'
}).subscribe();
```

> ⚠️ Para testes, use [https://webhook.site/](https://webhook.site) e desative o CORS ou use um proxy.

---

## 🖼️ GIFs de Demonstração

Confira os GIFs da aplicação na pasta [`src/assets/gifs`](https://github.com/gusteugenio/pokeapp-ionic/tree/main/src/assets/gifs), demonstrando:

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

<p align="center"><strong>Feito com 💛 por um fã de Pokémon e de código limpo!</strong></p>
