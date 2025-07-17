require('dotenv').config({ path: './auth-backend/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');
const trainerRoutes = require('./routes/trainer');

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/auth', authRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/trainer', trainerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Auth backend rodando em http://localhost:${process.env.PORT}`);
});
