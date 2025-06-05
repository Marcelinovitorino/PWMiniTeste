const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/db');

// Página de login
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// Página de registro
router.get('/register', (req, res) => {
  res.render('auth/register', { title: null });
});

// Processar registro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash], (err) => {
    if (err) {
      // Renderizar com caminho correto da view auth/register
      return res.render('auth/register', { error: 'Erro ao registrar ou e-mail já existente.', title: null });
    }
    res.redirect('/login');
  });
});

// Processar login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      // Renderizar com caminho correto da view auth/login
      return res.render('auth/login', { error: 'E-mail ou senha inválidos.', title: null });
    }

    const usuario = results[0];
    const senhasIguais = await bcrypt.compare(senha, usuario.senha);

    if (senhasIguais) {
      req.session.usuario = usuario;
      res.redirect('/eventos');
    } else {
      // Renderizar com caminho correto da view auth/login
      res.render('auth/login', { error: 'E-mail ou senha inválidos.', title: null });
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
