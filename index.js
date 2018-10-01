const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

const validateMiddleware = (req, res) => {
  const DATA_NASCIMENTO = `${req.body.data_de_nascimento}`;
  const NOME = `${req.body.nome}`;

  if (NOME !== '' && DATA_NASCIMENTO !== '' && moment(DATA_NASCIMENTO, 'DD/MM/YYYY').isValid()) {
    const idade = moment().diff(moment(DATA_NASCIMENTO, 'DD/MM/YYYY'), 'years');

    if (idade > 18) {
      res.redirect(`/major?nome=${NOME}`);
    } else if (idade <= 18) {
      res.redirect(`/minor?nome=${NOME}`);
    }
  } else {
    res.render('main', { error: 'Dados incompletos' });
  }
};

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/major', (req, res) => {
  res.render('major', { nome: `${req.query.nome}` });
});

app.get('/minor', (req, res) => {
  res.render('minor', { nome: `${req.query.nome}` });
});

app.post('/check', validateMiddleware, () => {});

app.listen(3000);
