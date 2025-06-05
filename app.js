const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');  // <-- importação

const app = express();

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@maylon12',
  database: 'eventoscomunidade'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'segredo123',
    resave: false,
    saveUninitialized: false
}));

// Configuração do EJS
app.use(expressLayouts);                // <-- habilita o express-ejs-layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');            // <-- define o arquivo layout.ejs padrão dentro da pasta views

// Rotas
const authRoutes = require('./routes/auth');
const eventosRoutes = require('./routes/eventos');
const participantesRoutes = require('./routes/participantes');

app.use('/', authRoutes);
app.use('/eventos', eventosRoutes);
app.use('/participantes', participantesRoutes);

const PORT = 4400;
app.listen(PORT, () => {
    console.log(`Servidor rodando na url = http://localhost:${PORT}`);
});
