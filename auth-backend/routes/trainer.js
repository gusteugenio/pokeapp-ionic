const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/get-trainer-info', async (req, res) => {
  const { userId } = req.query;
  
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    res.status(200).json({
      username: user.username,
      gender: user.gender
    });
  } catch (err) {
    console.error('Erro ao buscar informações do usuário', err);
    res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
  }
});

module.exports = router;
