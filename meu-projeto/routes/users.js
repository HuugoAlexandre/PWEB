var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const users = [
    { nome: 'Lucas', idade: 25 },
    { nome: 'Maria', idade: 30 },
    { nome: 'João', idade: 28 }
  ];

  res.render('users', { title: 'Usuários', users });
});

module.exports = router;
