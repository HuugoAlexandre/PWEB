const ContactRepository = require('../../domain/ports/ContactRepository');
const Contact = require('../../domain/entities/Contact');

class FakeContactRepository extends ContactRepository {
  constructor() {
    super();
    this._data = [];
    this._id = 1;
  }

  async create(contact) {
    const c = new Contact({ ...contact, id: this._id++ });
    this._data.push(c);
    return c;
  }

  async update(contact) {
    const idx = this._data.findIndex(x => x.id === contact.id);
    if (idx === -1) return null;

    const merged = new Contact({
      ...this._data[idx],
      ...contact
    });

    this._data[idx] = merged;
    return merged;
  }

  async deleteById(id) {
    this._data = this._data.filter(x => x.id !== id);
  }

  async findAll() {
    return this._data.slice();
  }

  async findById(id) {
    return this._data.find(x => x.id === id) || null;
  }
}

module.exports = FakeContactRepository;
