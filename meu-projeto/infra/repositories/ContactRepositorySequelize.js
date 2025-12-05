const ContactRepository = require('../../domain/ports/ContactRepository');
const Contact = require('../../domain/entities/Contact');

class ContactRepositorySequelize extends ContactRepository {
  /**
   * @param {Model} ContactModel - modelo Sequelize
   */
  constructor(ContactModel) {
    super();
    this.ContactModel = ContactModel;
  }

  _rowToEntity(row) {
    if (!row) return null;

    return new Contact({
      id: row.id,
      nome: row.nome,
      email: row.email,
      idade: row.idade,
      genero: row.genero || '',
      interesses: row.interesses ? row.interesses.split(',') : [],
      mensagem: row.mensagem,
      aceite: !!row.aceite,
      criadoEm: row.criado_em
    });
  }

  async create(Contact) {
    const interesses = Array.isArray(Contact.interesses)
      ? Contact.interesses.join(',')
      : (Contact.interesses || '');

    const row = await this.ContactModel.create({
      nome: Contact.nome,
      email: Contact.email,
      idade: Contact.idade || null,
      genero: Contact.genero || null,
      interesses,
      mensagem: Contact.mensagem,
      aceite: Contact.aceite
    });

    return this._rowToEntity(row.toJSON());
  }

  async update(Contact) {
    const interesses = Array.isArray(Contact.interesses)
      ? Contact.interesses.join(',')
      : (Contact.interesses || '');

    await this.ContactModel.update(
      {
        nome: Contact.nome,
        email: Contact.email,
        idade: Contact.idade || null,
        genero: Contact.genero || null,
        interesses,
        mensagem: Contact.mensagem,
        aceite: Contact.aceite
      },
      {
        where: { id: Contact.id }
      }
    );

    const row = await this.ContactModel.findByPk(Contact.id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async deleteById(id) {
    await this.ContactModel.destroy({ where: { id } });
  }

  async findAll() {
    const rows = await this.ContactModel.findAll({
      order: [['criado_em', 'DESC']]
    });
    return rows.map(r => this._rowToEntity(r.toJSON()));
  }

  async findById(id) {
    const row = await this.ContactModel.findByPk(id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }
}

module.exports = ContactRepositorySequelize;
