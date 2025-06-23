# 📱 Pokedex App - Ionic + Angular + PokeAPI

Site construído com Ionic + Angular, que consome a [PokeAPI](https://pokeapi.co) para listar, favoritar e visualizar detalhes dos Pokémons.

---

## ▶️ Como rodar o projeto

### 1. Clone o repositório:

```bash
git clone https://github.com/gusteugenio/pokeapp-ionic.git
cd pokeapp-ionic
```

### 2. Com Docker (Recomendado para configuração fácil e ambiente isolado)

Com o Docker, você pode rodar a aplicação em um ambiente isolado, sem precisar configurar dependências manualmente.

Certifique-se de que o Docker e o Docker Compose estão instalados.

Rode o comando abaixo para construir a imagem Docker e iniciar a aplicação:

```bash
docker-compose up --build
```

A aplicação estará disponível em [http://localhost:8100](http://localhost:8100).

### 3. Sem Docker (Método tradicional)

Se preferir rodar sem o Docker, siga os passos abaixo:

- Instale as dependências:

```bash
npm install
```

- Execute o servidor Ionic:

```bash
ionic serve
```

A aplicação estará disponível em [http://localhost:8100](http://localhost:8100).

---

## 💡 Sobre o projeto 

- Estrutura baseada em componentes e serviços independentes (separação de responsabilidades).
- Comunicação com a API utilizando `HttpClient` com injeção de dependência.
- Tela inicial com lista paginada de Pokémons para melhor performance e UX.
- Funcionalidade de capturar (favoritar) Pokémons, com listagem em tela específica. 
- Página de detalhes com altura, peso, tipos, habilidades e entrada da Pokédex.
- Gráfico de Status: Na tela de detalhes, um gráfico exibe os atributos do Pokémon.
- Design inspirado na estética da franquia Pokémon (vermelho, amarelo e azul).
- Utilização mínima de bibliotecas externas para manter o desempenho alto.
- Responsivo e adaptado a diferentes dispositivos e orientações de tela.
- Código limpo, organizado e reutilizável, seguindo boas práticas.
- Histórico de commits frequente com mensagens descritivas.

---

## 🏆 Área do Treinador
Uma área dedicada para o usuário se sentir parte do universo Pokémon!

- Perfil Personalizado: O usuário pode definir seu nome e gênero, escolhendo entre os avatares de Ash e Serena.
- Sistema de Níveis: A jornada do treinador é recompensada com um sistema de progressão.
- Progressão: A cada 5 Pokémons capturados, o treinador sobe 1 nível.
- Nível Máximo: O desafio vai até o nível 50.
- Status: A área exibe o total de Pokémons capturados e quantos faltam para o próximo nível.
- Badges: O nível atual é representado por badges (Bronze, Prata e Ouro) que mudam conforme o progresso.
- Motivação: Mensagens personalizadas são exibidas para encorajar o treinador de acordo com seu nível atual.
- Progresso Total: Uma barra de progresso mostra a porcentagem para atingir o Nível Máximo.

---

## 🛠️ Tecnologias usadas

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [PokeAPI](https://pokeapi.co)
- [Chart.js](https://www.chartjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)

---

## 🎞️ GIFs

Os GIFs do projeto estão localizados em [`src/assets/gifs`](https://github.com/gusteugenio/pokeapp-ionic/tree/main/src/assets/gifs) e demonstram:

- Paginação da lista de Pokémons
- Filtragem por tipos
- Busca de Pokémon
- Tela de detalhes de um Pokémon
- Tela de capturados
- Área do Treinador e sistema de níveis

---

## ✨ Diferenciais

- Interface fiel à identidade visual do universo Pokémon.
- Mensagens customizadas no estilo do anime como feedback ao usuário.
- Estilo visual consistente e agradável.
- Funcionalidade de busca por nome ou id.
- Filtro por tipo de Pokémon.
- Cor de cards de acordo com tipo principal do Pokémon.
- Área do Treinador.
- Cobertura de testes unitários para garantir a estabilidade e o correto funcionamento das funcionalidades.
- Uso de Webhooks ao favoritar/desfavoritar Pokémon.
- Ambiente com Docker, permitindo fácil replicação e execução do projeto.

> ⚠️ **Atenção sobre Webhooks:**  
> Para o funcionamento correto dos webhooks, é necessário desativar o CORS ou configurar permissões para permitir requisições de outras origens.
