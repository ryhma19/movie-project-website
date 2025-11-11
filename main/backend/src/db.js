import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()

const { Pool } = pkg

const pool = new Pool ({
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
    } catch (err) {
        console.error('Postgres connection failed', err.message)
    }
}

testConnection()

export { pool }