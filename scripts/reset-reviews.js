import pg from 'pg';

const { Pool } = pg;

async function resetReviews() {
  const pool = new Pool({
    user: 'doadmin',
    password: 'AVNS_GUQCIg9T0u45BV-7CyN',
    host: 'webshop-postgresql-fra1-43263-do-user-13924298-0.g.db.ondigitalocean.com',
    port: 25060,
    database: 'defaultdb',
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log(' Starting reviews migration...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id, order_id)
      );
    `);
    console.log(' Reviews table created');
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
    `);
    console.log(' Indexes created');
    
    await pool.query(`
      UPDATE products 
      SET rating = 0, review_count = 0 
      WHERE rating != 0 OR review_count != 0;
    `);
    console.log('Product ratings reset to 0');
    
    console.log(' Reviews migration completed successfully!');
  } catch (error) {
    console.error(' Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

resetReviews().then(() => {
  console.log('Migration complete!');
  process.exit(0);
}).catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});