const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      gender
    });
    res.status(201).json({message: 'Usuário criado com sucesso!'});
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar. Verifique os dados.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ 
    token,
    id: user._id
 });
});

module.exports = router;
