const fs = require('fs');
const path = require('path');
const os = require('os');
const { createSqliteDb } =
  require('../../infra/db/sqliteFactory');

const ContactRepositorySqlite =
  require('../../infra/repositories/ContactRepositorySqlite');

const ContactService =
  require('../../application/services/ContactService');

function createTmpDbPath() {
  const file = path.join(
    os.tmpdir(),
    `contacts-test-${Date.now()}-${Math.random()}.db`
  );
  return file;
}

function buildServiceWithTmpDb() {
  const dbPath = createTmpDbPath();
  const db = createSqliteDb(dbPath);
  const repo = new ContactRepositorySqlite(db);
  const service = new ContactService(repo);

  return { db, repo, service, dbPath };
}

module.exports = { buildServiceWithTmpDb };
