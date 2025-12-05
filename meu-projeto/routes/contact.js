const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const container = require('../container');

const ContactController = require('../controllers/ContactController');
const controller = new ContactController(container.contactService);

// Create
router.get(
  '/',
  asyncHandler(controller.form.bind(controller))
);

router.post(
  '/',
  validate(controller.regrasCriar()),
  asyncHandler(controller.criar.bind(controller))
);

// Read
router.get(
  '/list',
  asyncHandler(controller.lista.bind(controller))
);

// Update
router.get(
  '/:id/edit',
  asyncHandler(controller.editarForm.bind(controller))
);

router.post(
  '/:id/edit',
  validate(controller.regrasEditar()),
  asyncHandler(controller.editar.bind(controller))
);

// Delete
router.post(
  '/:id/delete',
  asyncHandler(controller.excluir.bind(controller))
);

module.exports = router;