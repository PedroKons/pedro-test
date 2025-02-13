const Fastify = require('fastify');
const { Pool } = require('pg');

const fastify = Fastify({ logger: true });

const pool = new Pool({
  user: process.env.DB_USER || 'seu_usuario',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'seu_banco',
  password: process.env.DB_PASSWORD || 'sua_senha',
  port: process.env.DB_PORT || 5432,  // Porta padrão do Postgres
});

const PORT = process.env.PORT || 5000; 
const HOST = '0.0.0.0';

fastify.get('/ping', async (request, reply) => {
  return { message: 'pong' };
});

// Rota para testar a conexão com o banco
fastify.get('/db-test', async (request, reply) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time');
    client.release(); // Libera a conexão de volta para o pool
    return { success: true, time: result.rows[0].current_time };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
