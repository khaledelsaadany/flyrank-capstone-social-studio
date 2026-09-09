const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config');
let dbInstance = null;
function getDatabase(customPath = null) {
  if (!customPath && dbInstance) return dbInstance;
  const dbPath = customPath || config.databasePath;
  if (dbPath !== ':memory:') { const dir = path.dirname(dbPath); if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true}); }
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON');
  const schemaPath = path.join(__dirname,'schema.sql'); db.exec(fs.readFileSync(schemaPath,'utf8'));
  if (!customPath) dbInstance = db;
  return db;
}
function resetDatabase(customPath){ const db=getDatabase(customPath); db.exec('DELETE FROM publish_history; DELETE FROM schedule_slots; DELETE FROM variants; DELETE FROM posts;'); return db; }
module.exports={getDatabase,resetDatabase};
