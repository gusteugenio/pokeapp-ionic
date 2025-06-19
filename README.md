📱 Pokedex App - Ionic + Angular + PokeAPI

Site construído com Ionic + Angular, que consome a PokeAPI (https://pokeapi.co) para listar, favoritar e visualizar detalhes dos Pokémons.

---

▶️ Como rodar o projeto

1. Clone o repositório:

```bash
  git clone https://github.com/gusteugenio/pokeapp-ionic.git
  cd pokeapp
```
2. Instale as dependências:
```bash
  npm install
```

3. Execute o server:
```bash
  ionic serve
```
---

💡 Sobre o projeto 

- O projeto foi estruturado com componentes e serviços independentes, promovendo separação de responsabilidades.
- Toda comunicação com a API foi feita com HttpClient, utilizando injeção de dependência.
- A tela inicial lista os Pokémons com paginação, otimizando a performance e UX.
- Cada Pokémon pode ser "capturado" (favoritado) e visualizado posteriormente em uma tela específica.
- A interface de detalhes apresenta informações como altura, peso, tipos, habilidades e uma entrada de Pokédex.
- O design remete ao universo Pokémon, com cores inspiradas na franquia (vermelho, amarelo e azul) sem exageros.
- Utilizei somente bibliotecas essenciais, mantendo o bundle leve e o desempenho elevado.
- O projeto é responsivo e adaptado para dispositivos móveis e diferentes orientações de tela.
- A estrutura do código segue boas práticas de organização, legibilidade e reusabilidade.
- Os commits foram feitos com frequência e mensagens descritivas, facilitando a revisão e histórico.

---

🛠️ Tecnologias usadas

- Ionic Framework (https://ionicframework.com/)
- Angular (https://angular.io/)
- PokeAPI (https://pokeapi.co)
- TypeScript (https://www.typescriptlang.org/)

---

🎞️ GIFs

Os GIFs do projeto estão em `src/assets/gifs` e mostram:

- A paginação da lista de Pokémons
- A página de detalhes de um Pokémon
- A página de favoritos

---

✨ Diferenciais

- Interface fiel à identidade Pokémon.
- Mensagens customizadas no estilo do anime para feedback ao usuário.
- Estilo visual consistente e agradável.
- Uso de Webhooks ao favoritar/desfavoritar pokémon

> ⚠️ **Atenção sobre Webhooks:**  
> Para o funcionamento correto dos webhooks, é necessário desativar o CORS ou configurar permissões para permitir requisições de outras origens.
