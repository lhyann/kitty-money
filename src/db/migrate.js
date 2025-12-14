// src/db/migrate.js
import { SCHEMA_V1 } from './schema';

const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db) {
  // 读当前版本（Expo 官方推荐用 PRAGMA user_version 做迁移版本号）:contentReference[oaicite:2]{index=2}
  const row = await db.getFirstAsync('PRAGMA user_version');
  let current = row.user_version ?? 0;

  if (current >= DATABASE_VERSION) return;

  // 建议开启 WAL（官方示例也这么做）:contentReference[oaicite:3]{index=3}
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  if (current === 0) {
    // execAsync 适合跑一串建表语句；但它不自动转义参数，别拿它拼用户输入:contentReference[oaicite:4]{index=4}
    await db.execAsync(SCHEMA_V1);

    // 可选：给几个默认分类
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO categories (name, icon, color, created_at) VALUES (?, ?, ?, ?)`,
      '饮料', '🥤', '#7FB3D5', now
    );
    await db.runAsync(
      `INSERT INTO categories (name, icon, color, created_at) VALUES (?, ?, ?, ?)`,
      '食物', '🍔', '#F5B041', now
    );
    await db.runAsync(
      `INSERT INTO categories (name, icon, color, created_at) VALUES (?, ?, ?, ?)`,
      '其他', '🛍️', '#7d41f5ff', now
    );

    current = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
