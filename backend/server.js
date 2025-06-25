const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const LOG_FILE = path.join(__dirname, 'logs.txt');

app.use(cors());
app.use(express.json());

function writeLog(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFile(LOG_FILE, logLine, err => {
    if (err) {
      console.error('Erro ao salvar log:', err);
    }
  });
}

app.post('/webhook', (req, res) => {
  const { event, pokemon, trainerName, trainerGender, fromLevel, toLevel } = req.body;

  const nome = trainerName || 'desconhecido';

  const isFemale = trainerGender === 'female';
  const artigo = isFemale ? 'A' : 'O';
  const papel = isFemale ? 'treinadora' : 'treinador';
  const preposicao = isFemale ? 'pela' : 'pelo';

  let mensagem = '';

  switch (event) {
    case 'level_up':
      mensagem = `${artigo} ${papel} ${nome} aumentou o nível: ${fromLevel} → ${toLevel}`;
      break;

    case 'level_down':
      mensagem = `${artigo} ${papel} ${nome} diminuiu o nível: ${fromLevel} → ${toLevel}`;
      break;

    case 'favorited':
      mensagem = `Pokémon ${pokemon} foi favoritado ${preposicao} ${papel} ${nome}`;
      break;

    case 'unfavorited':
      mensagem = `Pokémon ${pokemon} foi desfavoritado ${preposicao} ${papel} ${nome}`;
      break;

    case 'favorites_cleared':
      mensagem = `Todos os pokémons foram desfavoritados ${preposicao} ${papel} ${nome}`;
      break;

    default:
      mensagem = `Evento desconhecido: ${JSON.stringify(req.body)}`;
  }

  writeLog(mensagem);
  res.status(200).send({ received: true });
});

app.listen(PORT, () => {
  console.log(`Servidor webhook rodando em http://localhost:${PORT}`);
});
