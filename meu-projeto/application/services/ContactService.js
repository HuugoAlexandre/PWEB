const Contact = require('../../domain/entities/Contact');

class ContactService {
  /**
   * @param {ContactRepository} repo
   */
  constructor(repo) {
    this.repo = repo;
  }

  async criar(payload) {
    // Regras de orquestração (negócio leve): normalizações e delega ao repo
    const contact = new Contact(payload);
    return await this.repo.create(contact);
  }

  async listar() {
    return await this.repo.findAll();
  }

  async obter(id) {
    return await this.repo.findById(Number(id));
  }

  async atualizar(id, payload) {
    const atual = await this.repo.findById(Number(id));
    if (!atual) return null;

    const contact = new Contact({
      ...atual,
      ...payload,
      id: Number(id)
    });

    return await this.repo.update(contact);
  }

  async excluir(id) {
    await this.repo.deleteById(Number(id));
  }
}

module.exports = ContactService;
