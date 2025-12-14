// src/db/client.js
export async function enableForeignKeys(db) {
  await db.execAsync('PRAGMA foreign_keys = ON;');
}

// 用于统一把 Date.now() 塞进去
export function nowMs() {
  return Date.now();
}
