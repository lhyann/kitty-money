// src/db/categories.js
import { nowMs } from './client';

export async function createCategory(db, { name, icon = null, color = null }) {
  const createdAt = nowMs();
  const result = await db.runAsync(
    `INSERT INTO categories (name, icon, color, created_at)
     VALUES (?, ?, ?, ?)`,
    name,
    icon,
    color,
    createdAt
  );
  return result.lastInsertRowId;
}

export async function listCategories(db) {
  return db.getAllAsync(
    `SELECT id, name, icon, color, created_at
     FROM categories
     ORDER BY id ASC`
  );
}

export async function getCategoryById(db, id) {
  return db.getFirstAsync(
    `SELECT id, name, icon, color, created_at
     FROM categories
     WHERE id = ?`,
    id
  );
}

export async function updateCategory(db, { id, name, icon = null, color = null }) {
  await db.runAsync(
    `UPDATE categories
     SET name = ?, icon = ?, color = ?
     WHERE id = ?`,
    name,
    icon,
    color,
    id
  );
}

// MVP 阶段可以硬删；如果你后续要“回收站”，可以改成加 deleted_at
export async function deleteCategory(db, id) {
  await db.runAsync(`DELETE FROM categories WHERE id = ?`, id);
}
