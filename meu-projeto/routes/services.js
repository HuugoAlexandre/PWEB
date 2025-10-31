var express = require('express');
var router = express.Router();

/* GET services page. */
router.get('/', function(req, res, next) {
  const services = [
    'Desenvolvimento Web',
    'APIs com Node.js',
    'Integrações com Banco de Dados',
    'Aplicações Front-end com React'
  ];

  res.render('services', { title: 'Serviços', services });
});

module.exports = router;