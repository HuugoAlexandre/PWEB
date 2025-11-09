// db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Diretório do banco de dados
const dbDir = path.join(__dirname, 'data');

// Cria o diretório se não existir
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Caminho do arquivo do banco
const dbPath = path.join(dbDir, 'contacts.db');

// Inicializa o banco SQLite
const db = new Database(dbPath);

// Criação da tabela (executa uma vez e garante a estrutura)
db.prepare(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    idade INTEGER,
    genero TEXT,
    interesses TEXT,
    mensagem TEXT NOT NULL,
    aceite INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

module.exports = db;
