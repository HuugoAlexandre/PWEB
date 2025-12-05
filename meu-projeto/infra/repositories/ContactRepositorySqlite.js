const ContactRepository = require('../../domain/ports/ContactRepository');
const Contact = require('../../domain/entities/Contact');

class ContactRepositorySqlite extends ContactRepository {
  constructor(db) {
    super();
    this.db = db;

    this.stmts = {
      insert: this.db.prepare(`
        INSERT INTO contacts (nome, email, idade, genero, interesses, mensagem, aceite)
        VALUES (@nome, @email, @idade, @genero, @interesses, @mensagem, @aceite)
      `),

      update: this.db.prepare(`
        UPDATE contacts
        SET nome=@nome,
            email=@email,
            idade=@idade,
            genero=@genero,
            interesses=@interesses,
            mensagem=@mensagem,
            aceite=@aceite
        WHERE id=@id
      `),

      delete: this.db.prepare(`
        DELETE FROM contacts WHERE id=?
      `),

      findAll: this.db.prepare(`
        SELECT id, nome, email, idade, genero, interesses, mensagem, criado_em, aceite
        FROM contacts
        ORDER BY criado_em DESC
      `),

      findById: this.db.prepare(`
        SELECT id, nome, email, idade, genero, interesses, mensagem, criado_em, aceite
        FROM contacts
        WHERE id=?
      `),
    };
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

  async create(contact) {
    const interesses = Array.isArray(contact.interesses)
      ? contact.interesses.join(',')
      : (contact.interesses || '');

    const info = this.stmts.insert.run({
      nome: contact.nome,
      email: contact.email,
      idade: contact.idade || null,
      genero: contact.genero || null,
      interesses,
      mensagem: contact.mensagem,
      aceite: contact.aceite ? 1 : 0
    });

    return this.findById(info.lastInsertRowid);
  }

  async update(contact) {
    const interesses = Array.isArray(contact.interesses)
      ? contact.interesses.join(',')
      : (contact.interesses || '');

    this.stmts.update.run({
      id: contact.id,
      nome: contact.nome,
      email: contact.email,
      idade: contact.idade || null,
      genero: contact.genero || null,
      interesses,
      mensagem: contact.mensagem,
      aceite: contact.aceite ? 1 : 0
    });

    return this.findById(contact.id);
  }

  async deleteById(id) {
    this.stmts.delete.run(id);
  }

  async findAll() {
    return this.stmts.findAll.all().map(r => this._rowToEntity(r));
  }

  async findById(id) {
    const row = this.stmts.findById.get(id);
    return this._rowToEntity(row);
  }
}

module.exports = ContactRepositorySqlite;
