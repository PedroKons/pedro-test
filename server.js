const Fastify = require('fastify');
const fastify = Fastify({ logger: true });

fastify.get('/ping', async (request, reply) => {
  return { message: 'pong' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://0.0.0.0:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
