const express = require('express');
const router = express.Router();
const db = require('../models/db');
const PDFDocument = require('pdfkit');

// Listar participantes de um evento
router.get('/:eventoId', (req, res) => {
  const eventoId = req.params.eventoId;
  db.query(
    'SELECT * FROM participantes WHERE evento_id = ?',
    [eventoId],
    (err, participantes) => {
      if (err) return res.send('Erro ao buscar participantes.');
      res.render('participantes/listar', { participantes, eventoId });
    }
  );
});

// Formulário de inscrição
router.get('/inscrever/:eventoId', (req, res) => {
  const eventoId = req.params.eventoId;
  res.render('participantes/inscrever', { eventoId, erro: null });
});

// Inscrever participante
router.post('/inscrever/:eventoId', (req, res) => {
  const eventoId = req.params.eventoId;
  const { nome, email, telefone } = req.body;

  // Verificar se ainda há vagas
  db.query(
    'SELECT COUNT(*) AS total, (SELECT max_participantes FROM eventos WHERE id = ?) AS limite FROM participantes WHERE evento_id = ?',
    [eventoId, eventoId],
    (err, results) => {
      if (err) return res.send('Erro ao verificar limite de participantes.');

      const total = results[0].total;
      const limite = results[0].limite;

      if (total >= limite) {
        return res.render('participantes/inscrever', { eventoId, erro: 'Limite de participantes atingido!' });
      }

      db.query(
        'INSERT INTO participantes (nome, email, telefone, evento_id) VALUES (?, ?, ?, ?)',
        [nome, email, telefone, eventoId],
        (err) => {
          if (err) return res.send('Erro ao inscrever participante.');
          res.redirect(`/participantes/${eventoId}`);
        }
      );
    }
  );
});

// Nova rota para gerar PDF da lista de participantes
router.get('/pdf/:eventoId', (req, res) => {
  const eventoId = req.params.eventoId;

  db.query('SELECT nome, email, telefone FROM participantes WHERE evento_id = ?', [eventoId], (err, participantes) => {
    if (err) return res.send('Erro ao buscar participantes para gerar PDF.');

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Define headers para baixar o PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=participantes_evento_${eventoId}.pdf`);

    // Envia o PDF para a resposta HTTP
    doc.pipe(res);

    doc.fontSize(18).text(`Lista de Participantes - Evento ${eventoId}`, { align: 'center' });
    doc.moveDown();

    if (participantes.length === 0) {
      doc.fontSize(14).text('Nenhum participante inscrito neste evento.', { align: 'center' });
    } else {
      participantes.forEach((p, i) => {
        doc.fontSize(12).text(`${i + 1}. Nome: ${p.nome}`);
        doc.text(`   Email: ${p.email}`);
        doc.text(`   Telefone: ${p.telefone}`);
        doc.moveDown();
      });
    }

    doc.end();
  });
});

module.exports = router;
