
import { open } from 'react-native-nitro-sqlite';

let db: any;

export const initDB = async () => {
  db = open({ name: 'GoStock' });

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  await db.execute(`INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)`, [
    'demo@gostock.com',
    '123456',
    ]);

    // const result = await db.execute(
    // `SELECT * FROM users WHERE email = ? AND password = ?`,
    // ['demo@gostock.com', '123456']
    // );
    // console.log(result.rows);


    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
      );
    `);
    // create products table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT UNIQUE,
        name TEXT,
        description TEXT,
        price TEXT,
        category TEXT,
        stock INTEGER,
        images TEXT
      );
    `);
};

export const getDB = () => db;

  export const addCategory = async (name: string) => {
    if (!db) throw new Error('DB not initialized')
    const res = await db.execute(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [name])
    return res
  }

  export const addProduct = async (product: {
    uid: string
    name: string
    description?: string
    price?: string
    category?: string
    stock?: number
    images?: any
  }) => {
    if (!db) throw new Error('DB not initialized')
    const imagesJson = product.images ? JSON.stringify(product.images) : null
    const res = await db.execute(
      `INSERT OR REPLACE INTO products (uid, name, description, price, category, stock, images) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product.uid, product.name, product.description || '', product.price || '', product.category || '', product.stock || 0, imagesJson]
    )
    return res
  }

  export const getProducts = async () => {
    if (!db) throw new Error('DB not initialized')
    const res = await db.execute(`SELECT id, uid, name, description, price, category, stock, images FROM products ORDER BY id DESC`)
    // normalize common row shapes
    if (res._array) return res._array
    if (res.rows) return res.rows
    return res
  }

  export const getProductByUid = async (uid: string) => {
    if (!db) throw new Error('DB not initialized')
    const res = await db.execute(`SELECT id, uid, name, description, price, category, stock, images FROM products WHERE uid = ? LIMIT 1`, [uid])
    if (res._array && res._array.length > 0) return res._array[0]
    if (res.rows && typeof res.rows.item === 'function' && res.rows.length > 0) return res.rows.item(0)
    if (Array.isArray(res) && res.length > 0) return res[0]
    return null
  }

  export const updateProduct = async (uid: string, product: {
    name?: string
    description?: string
    price?: string
    category?: string
    stock?: number
    images?: any
  }) => {
    if (!db) throw new Error('DB not initialized')
    const imagesJson = product.images ? JSON.stringify(product.images) : null
    const res = await db.execute(
      `UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, images = ? WHERE uid = ?`,
      [product.name || '', product.description || '', product.price || '', product.category || '', product.stock || 0, imagesJson, uid]
    )
    return res
  }

  export const deleteProduct = async (uid: string) => {
    if (!db) throw new Error('DB not initialized')
    const res = await db.execute(`DELETE FROM products WHERE uid = ?`, [uid])
    return res
  }

  export const getCategories = async () => {
    if (!db) throw new Error('DB not initialized')
    const res = await db.execute(`SELECT id, name FROM categories ORDER BY id DESC`)
    return res.rows || []
  }

  export const updateCategory = async (id: number, name: string) => {
    if (!db) throw new Error('DB not initialized')
    const res = await db.execute(`UPDATE categories SET name = ? WHERE id = ?`, [name, id])
    return res
  }

  export const deleteCategory = async (id: number) => {
    if (!db) throw new Error('DB not initialized')
    const res = await db.execute(`DELETE FROM categories WHERE id = ?`, [id])
    return res
  }
