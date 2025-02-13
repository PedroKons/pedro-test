const Fastify = require('fastify');
const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 5000;  // Alterado para 3001
const HOST = '0.0.0.0';

fastify.get('/ping', async (request, reply) => {
  return { message: 'pong' };
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
