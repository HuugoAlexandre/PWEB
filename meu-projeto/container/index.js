const { createSequelizeInstance } = require('../infra/db/sequelize');
const { defineContactModel } = require('../infra/db/models/ContactModel');
const ContactRepositorySequelize = require('../infra/repositories/ContactRepositorySequelize');
const ContactService = require('../application/services/ContactService');

// Cria a instância do Sequelize
const sequelize = createSequelizeInstance();

// Define o modelo
const ContactModel = defineContactModel(sequelize);

// Garante que a tabela exista (sync)
sequelize
  .sync()
  .then(() => console.log('Banco sincronizado com Sequelize (ORM).'))
  .catch(err => console.error('Erro ao sincronizar banco:', err));

// Cria o repository ORM
const contactRepository = new ContactRepositorySequelize(ContactModel);

// Cria o service
const contactService = new ContactService(contactRepository);

module.exports = {
  sequelize,
  ContactModel,
  contactRepository,
  contactService
};
