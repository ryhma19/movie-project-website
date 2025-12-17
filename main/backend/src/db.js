import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()

const { Pool } = pkg

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Render-hostatussa Postgresissa SSL vaaditaan
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    })

export async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()')
        console.log('Postgres connection functional', res.rows[0].now)
        
        // Debug: tsekataan mihin databaseen ollaan yhteydessä
        const dbCheck = await pool.query('SELECT current_database()')
        console.log('Connected to database:', dbCheck.rows[0].current_database)
        
        // Debug: tsekataan onko media-taulu olemassa
        const tableCheck = await pool.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'media'"
        )
        console.log('Media table exists:', tableCheck.rows.length > 0, tableCheck.rows)
        
        // tsekataan montako riviä media-taulussa on
        const countRes = await pool.query('SELECT COUNT(*) FROM media')
        console.log('Media rows:', countRes.rows[0].count)
    } catch (err) {
        console.error('Postgres connection failed', err.message)
    }
}

if (process.env.NODE_ENV !== 'test') {
    testConnection()

    // Debug: ei tulosteta salasanaa
    console.log(
      'ENV:',
      process.env.PGUSER,
      process.env.PGHOST,
      process.env.PGDATABASE,
      '******',
      process.env.PGPORT,
      'using DATABASE_URL:',
      Boolean(process.env.DATABASE_URL)
    )
}

export { pool }
