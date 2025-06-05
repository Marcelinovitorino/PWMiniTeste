const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Middleware de autenticação
function autenticado(req, res, next) {
  if (req.session.usuario) return next();
  res.redirect('/login');
}

// Listar eventos do organizador
router.get('/', autenticado, (req, res) => {
  const id = req.session.usuario.id;
  db.query('SELECT * FROM eventos WHERE organizador_id = ?', [id], (err, eventos) => {
    if (err) return res.send('Erro ao listar eventos.');
    res.render('eventos/listar', { eventos });
  });
});

// Formulário de novo evento - agora enviando evento: null para evitar erro na view
router.get('/novo', autenticado, (req, res) => {
  res.render('eventos/novo', { evento: null });
});

// Criar evento
router.post('/criar', autenticado, (req, res) => {
  const { titulo, descricao, data, hora, local, max_participantes } = req.body;
  const id = req.session.usuario.id;

  db.query(
    'INSERT INTO eventos (titulo, descricao, data, hora, local, max_participantes, organizador_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [titulo, descricao, data, hora, local, max_participantes, id],
    (err) => {
      if (err) return res.send('Erro ao criar evento.');
      res.redirect('/eventos');
    }
  );
});

// Editar evento (formulário)
router.get('/editar/:id', autenticado, (req, res) => {
  db.query('SELECT * FROM eventos WHERE id = ? AND organizador_id = ?', [req.params.id, req.session.usuario.id], (err, results) => {
    if (err) return res.send('Erro ao buscar evento.');
    if (results.length === 0) return res.send('Evento não encontrado.');
    res.render('eventos/editar', { evento: results[0] });
  });
});

// Atualizar evento
router.post('/atualizar/:id', autenticado, (req, res) => {
  const { titulo, descricao, data, hora, local, max_participantes } = req.body;
  db.query(
    'UPDATE eventos SET titulo = ?, descricao = ?, data = ?, hora = ?, local = ?, max_participantes = ? WHERE id = ? AND organizador_id = ?',
    [titulo, descricao, data, hora, local, max_participantes, req.params.id, req.session.usuario.id],
    (err) => {
      if (err) return res.send('Erro ao atualizar evento.');
      res.redirect('/eventos');
    }
  );
});

// Deletar evento
router.get('/deletar/:id', autenticado, (req, res) => {
  const eventoId = req.params.id;
  const organizadorId = req.session.usuario.id;

  // Deletar participantes relacionados ao evento
  db.query('DELETE FROM participantes WHERE evento_id = ?', [eventoId], (err) => {
    if (err) {
      console.error('Erro ao deletar participantes do evento:', err);
      return res.send('Erro ao deletar participantes do evento.');
    }

    // Agora deletar o evento
    db.query('DELETE FROM eventos WHERE id = ? AND organizador_id = ?', [eventoId, organizadorId], (err, results) => {
      if (err) {
        console.error('Erro ao deletar evento:', err);
        return res.send('Erro ao deletar evento.');
      }
      if (results.affectedRows === 0) {
        return res.send('Evento não encontrado ou você não tem permissão para deletar.');
      }
      res.redirect('/eventos');
    });
  });
});


module.exports = router;
