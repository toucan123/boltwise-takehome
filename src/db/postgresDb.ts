import pgPromise from 'pg-promise';

const PG_PORT = 5432;

export const pgp = pgPromise({
  query(e) {
    console.log(e.query);
  }
});

export const db = pgp({
  host: process.env.DB_HOSTNAME,
  port: PG_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export const initDb = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS products (
        id character varying NOT NULL PRIMARY KEY,
        batch character varying NULL,
        available BOOLEAN NOT NULL,
        properties JSONB
      )
    `);

    await db.none(`
      CREATE TABLE IF NOT EXISTS seller_batch (
        seller character varying NOT NULL PRIMARY KEY,
        batch character varying NULL
      )
    `);

    await db.none(`
      CREATE TABLE IF NOT EXISTS orders (
        id character varying NOT NULL PRIMARY KEY,
        created_at timestamp NOT NULL,
        updated_at timestamp NOT NULL,
        properties JSONB
      )
    `);
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}
