const { body } = require('express-validator');

const regras = [
  body('nome')
    .trim()
    .isLength({ min: 3, max: 60 }).withMessage('Nome deve ter entre 3 e 60.')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome inválido.')
    .escape(),

  body('email')
    .trim()
    .isEmail().withMessage('E-mail inválido.')
    .normalizeEmail(),

  body('idade')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 120 }).withMessage('Idade 1..120')
    .toInt(),

  body('genero')
    .isIn(['', 'feminino', 'masculino', 'nao-binario', 'prefiro-nao-informar'])
    .withMessage('Gênero inválido.'),

  body('interesses')
    .optional({ checkFalsy: true })
    .customSanitizer(v => Array.isArray(v) ? v : (v ? [v] : []))
    .custom(arr => {
      const valid = ['node', 'express', 'ejs', 'frontend', 'backend'];
      return arr.every(x => valid.includes(x));
    })
    .withMessage('Interesse inválido.'),

  body('mensagem')
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('Mensagem 10..500')
    .escape(),

  body('aceite')
    .equals('on')
    .withMessage('Aceite os termos.')
];


class ContactController {
  constructor(service) {
    this.service = service;
  }

  regrasCriar() { return regras; }
  regrasEditar() { return regras; }

  async form(req, res) {
    res.render('contact', {
      title: 'Formulário de Contato',
      data: {},
      errors: {}
    });
  }

  async criar(req, res) {
    if (req.validationMapped) {
      return res.status(400).render('contact', {
        title: 'Formulário de Contato',
        data: this._payload(req.body),
        errors: req.validationMapped
      });
    }

    const contact = await this.service.criar(this._payload(req.body));

    return res.render('sucesso', {
      title: 'Enviado com sucesso',
      data: contact
    });
  }

  async lista(req, res) {
    const contacts = await this.service.listar();
    res.render('contact-list', {
      title: 'Lista de Contatos',
      contacts
    });
  }

  async editarForm(req, res) {
    const id = Number(req.params.id);
    const contact = await this.service.obter(id);

    if (!contact) return res.redirect('/contact/list');

    res.render('contact-edit', {
      title: 'Editar Contato',
      data: contact,
      errors: {}
    });
  }

  async editar(req, res) {
    const id = Number(req.params.id);

    if (req.validationMapped) {
      const data = this._payload(req.body);
      data.id = id;

      return res.status(400).render('contact-edit', {
        title: 'Editar Contato',
        data,
        errors: req.validationMapped
      });
    }

    await this.service.atualizar(id, this._payload(req.body));

    return res.redirect('/contact/list');
  }

  async excluir(req, res) {
    const id = Number(req.params.id);
    await this.service.excluir(id);
    res.redirect('/contact/list');
  }

  _payload(body) {
    return {
      nome: body.nome,
      email: body.email,
      idade: body.idade || null,
      genero: body.genero || '',
      interesses: body.interesses || [],
      mensagem: body.mensagem,
      aceite: body.aceite === 'on'
    };
  }
}

module.exports = ContactController;
