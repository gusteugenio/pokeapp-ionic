const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/sync-favorites', async (req, res) => {
  const { userId, favorites } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.favorites = favorites;
      await user.save();
      res.status(200).json({ message: 'Favoritos sincronizados com sucesso!' });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao sincronizar favoritos' });
  }
});

router.get('/get-favorites', async (req, res) => {
  const { userId } = req.query;
  
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter favoritos' });
  }
});


module.exports = router;
