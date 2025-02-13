require('dotenv').config();
const Fastify = require('fastify');
const { Pool } = require('pg');

const fastify = Fastify({ logger: true });

const pool = new Pool({
  user:  'postgres',
  host: 'api-estoque_pedro-test',
  database: 'api-estoque',
  password: 'e2855b5070056b84fed7',
  port: 5432,  // Porta padrão do PostgreSQL
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Criar a tabela automaticamente ao iniciar o servidor
const createTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);
    console.log("Tabela 'users' verificada/criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar a tabela:", error);
  } finally {
    client.release();
  }
};

// Rota para testar conexão com o banco de dados
fastify.get('/db-test', async (request, reply) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time');
    client.release(); // Libera a conexão de volta para o pool
    return { success: true, time: result.rows[0].current_time };
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
});

// Rota para adicionar um usuário
fastify.post('/users', async (request, reply) => {
  const { name } = request.body;
  
  if (!name) {
    return reply.status(400).send({ error: "O campo 'name' é obrigatório." });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name]
    );
    client.release();
    
    return reply.status(201).send(result.rows[0]);
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);
    return reply.status(500).send({ error: "Erro ao adicionar usuário." });
  }
});

const start = async () => {
  try {
    await createTable();
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
