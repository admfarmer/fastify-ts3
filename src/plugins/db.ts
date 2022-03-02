import fp from 'fastify-plugin'
const knex = require('knex')

module.exports = fp(async function (fastify: any, opts: any, done: any) {

  try {
    const handler = await knex(opts.options);
    fastify.decorate(opts.connectionName, handler);
    done();
  } catch (err) {
    done(err);
  }

})