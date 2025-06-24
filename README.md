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
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

</div>

---

## ✨ Destaques do Projeto

- 🔁 Paginação e busca dinâmica de Pokémons (inclusive por partes do nome, como "char" → "charmander" e outros resultados)
- ⭐ Favoritar (capturar) Pokémons com armazenamento local
- 📊 Tela de detalhes com gráfico de status via Chart.js
- 🧠 Área do Treinador com sistema de níveis, badges e progresso
- 🌐 Deploy contínuo via GitHub Pages
- 🧪 Testes unitários para funcionalidades chave
- 🔗 Integração com Webhooks para eventos de favoritar/desfavoritar e mudança de nível
- 🐳 Ambiente pronto para Docker
- 🖥️ Backend com Node.js (Express + CORS) gerando logs em `logs.txt` a cada evento

---

## 📦 Estrutura e Arquitetura

- **Componentização inteligente**: cada tela é isolada e independente
- **Services com responsabilidades claras**: comunicação com API, gestão de favoritos e progresso do treinador
- **Reatividade com RxJS**: Subject e BehaviorSubject usados para refletir atualizações em tempo real
- **Chamadas assíncronas paralelas** com `forkJoin` para performance
- **Separação de models** para melhor tipagem com TypeScript

---

## 🧪 Testes Unitários
Testes garantem que funcionalidades-chave, como o sistema de favoritos, funcionem corretamente e que mudanças futuras não quebrem o app.

```ts
it('should toggle favorite correctly', () => {
  service.addFavorite('pikachu');
  expect(JSON.parse(localStorage.getItem('pokemon_favorites')!)).toContain('pikachu');
  expect(service.isFavorite('pikachu')).toBeTrue();

  service.toggleFavorite('pikachu');
  expect(JSON.parse(localStorage.getItem('pokemon_favorites')!)).not.toContain('pikachu');
  expect(service.isFavorite('pikachu')).toBeFalse();
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

Executa tanto o frontend quanto o backend (servidor Express) de forma integrada:

```bash
docker-compose up --build
```

A aplicação estará disponível em: [http://localhost:8100](http://localhost:8100)

### 🔹 3. Manualmente (sem Docker)

Para executar apenas o frontend, rode os seguintes comandos:

```bash
npm install
ionic serve
```

Para executar ambos os serviços (frontend e backend) em paralelo, execute:

```bash
npm install
npm run start-log
```

Isso executará dois serviços em paralelo com `concurrently`:  
- O frontend (via `ionic serve`)  
- O backend Express (via `node backend/server.js`)

A aplicação estará disponível em: [http://localhost:8100](http://localhost:8100)

---

## 📡 Webhooks

> O projeto envia eventos para um servidor backend local (Node.js + Express) sempre que um Pokémon for favoritado/desfavoritado ou quando o nível do treinador for alterado.

### Como usar os webhooks localmente

1. **Descomente a variável `webhookUrl` e as linhas com `this.http.post(this.webhookUrl, ...)` nos arquivos `favorite.service.ts` e `trainer.service.ts`**.
3. Com o Docker, **descomente a chamada para a imagem do serviço backend no arquivo `docker-compose.yml`**.
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

> 💡 A URL padrão do webhook local é: `http://localhost:3000/webhook`  
> 💬 Se for usar [https://webhook.site](https://webhook.site), altere a URL e desative CORS via proxy ou extensão.

### Importante:
Essas chamadas estão comentadas por padrão. Para produção (GitHub Pages), mantenha assim. Para rodar localmente, **descomente** e rode o backend.

---

## 🏆 Área do Treinador

> Uma experiência gamificada no estilo Pokémon para o usuário.

- 👤 Escolha de nome e gênero (Ash ou Serena)
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
