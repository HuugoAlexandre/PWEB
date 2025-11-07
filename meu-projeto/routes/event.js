var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

/**
 * GET /evento – exibe o formulário vazio
 */
router.get('/', (req, res) => {
  res.render('event', {
    title: 'Cadastro de Evento',
    data: {},
    errors: {}
  });
});

/**
 * POST /evento – valida e processa o envio
 */
router.post(
  '/',
  [
    body('titulo')
      .trim()
      .isLength({ min: 5, max: 100 }).withMessage('Título deve ter entre 5 e 100 caracteres.')
      .escape(),

    body('descricao')
      .trim()
      .isLength({ min: 20, max: 1000 }).withMessage('Descrição deve ter entre 20 e 1000 caracteres.')
      .escape(),

    body('data')
      .isISO8601().withMessage('Data inválida.')
      .toDate()
      .custom(value => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera horas para comparar apenas datas
        if (value < hoje) {
          throw new Error('A data do evento não pode estar no passado.');
        }
        return true;
      }),
      
    body('hora')
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Hora deve estar no formato HH:MM.'),

    body('categoria')
      .isIn(['palestra', 'workshop', 'curso', 'webinar']).withMessage('Categoria inválida.'),

    body('vagas')
      .isInt({ min: 1, max: 500 }).withMessage('Vagas devem estar entre 1 e 500.')
      .toInt(),

    body('publico')
      .customSanitizer(v => Array.isArray(v) ? v : (v ? [v] : []))
      .custom(arr => {
        const valid = ['estudantes', 'profissionais', 'empresas', 'publico-geral'];
        return arr.every(x => valid.includes(x));
      })
      .withMessage('Público inválido.'),

    body('site')
      .optional({ checkFalsy: true })
      .isURL().withMessage('URL inválida.'),

    body('aceite')
      .equals('on').withMessage('Você deve aceitar os termos para continuar.')
  ],
  (req, res) => {
    const errors = validationResult(req);
    const data = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      data: req.body.data,
      hora: req.body.hora,
      categoria: req.body.categoria,
      vagas: req.body.vagas,
      publico: req.body.publico || [],
      site: req.body.site,
      aceite: req.body.aceite === 'on'
    };

    if (!errors.isEmpty()) {
      const mapped = errors.mapped();
      return res.status(400).render('event', {
        title: 'Cadastro de Evento',
        data,
        errors: mapped
      });
    }

    return res.render('sucess-event', {
      title: 'Evento cadastrado com sucesso',
      data
    });
  }
);

module.exports = router;
