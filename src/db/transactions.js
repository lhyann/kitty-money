// src/db/transactions.js
import { nowMs } from './client';

export async function createTransaction(db, {
  amount,            // INTEGER: 分
  type,              // 'expense' | 'income'
  categoryId = null,
  note = null,
  merchant = null,
  paymentMethod = null,
  occurredAt = null, // ms
}) {
  const createdAt = nowMs();
  const occurred = occurredAt ?? createdAt;

  const result = await db.runAsync(
    `INSERT INTO transactions
     (amount, type, category_id, note, merchant, payment_method, occurred_at, created_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    amount,
    type,
    categoryId,
    note,
    merchant,
    paymentMethod,
    occurred,
    createdAt
  );

  return result.lastInsertRowId;
}

export async function listTransactions(db, { limit = 200 } = {}) {
  return db.getAllAsync(
    `SELECT
        t.id, t.amount, t.type, t.category_id, t.note, t.merchant, t.payment_method,
        t.occurred_at, t.created_at, t.deleted_at,
        c.name AS category_name, c.icon AS category_icon, c.color AS category_color
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.deleted_at IS NULL
     ORDER BY t.occurred_at DESC
     LIMIT ?`,
    limit
  );
}

export async function getTransactionById(db, id) {
  return db.getFirstAsync(
    `SELECT * FROM transactions WHERE id = ?`,
    id
  );
}

export async function softDeleteTransaction(db, id) {
  await db.runAsync(
    `UPDATE transactions SET deleted_at = ? WHERE id = ?`,
    nowMs(),
    id
  );
}
