// src/db/stats.js

// 一段时间内总支出/总收入
export async function sumByType(db, { startMs, endMs }) {
  return db.getAllAsync(
    `SELECT type, SUM(amount) AS total
     FROM transactions
     WHERE deleted_at IS NULL
       AND occurred_at >= ?
       AND occurred_at < ?
     GROUP BY type`,
    startMs,
    endMs
  );
}

// 一段时间内按分类汇总（饼图）
export async function sumExpenseByCategory(db, { startMs, endMs }) {
  return db.getAllAsync(
    `SELECT
        t.category_id,
        c.name AS category_name,
        c.icon AS category_icon,
        c.color AS category_color,
        SUM(t.amount) AS total
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.deleted_at IS NULL
       AND t.type = 'expense'
       AND t.occurred_at >= ?
       AND t.occurred_at < ?
     GROUP BY t.category_id
     ORDER BY total DESC`,
    startMs,
    endMs
  );
}

// 日历/热力图用：按“天”汇总（用本地时区的话要在 JS 侧切天更稳）
export async function dailyTotals(db, { startMs, endMs }) {
  return db.getAllAsync(
    `SELECT
        (occurred_at / 86400000) AS day_index,
        SUM(amount) AS total
     FROM transactions
     WHERE deleted_at IS NULL
       AND occurred_at >= ?
       AND occurred_at < ?
     GROUP BY day_index
     ORDER BY day_index ASC`,
    startMs,
    endMs
  );
}
