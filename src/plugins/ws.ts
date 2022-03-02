import { FastifyPlugin, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

module.exports = fp(async function (fastify: any, opts: any, done: any) {

  const WebSocketServer = require('ws').Server

  const wsOpts: any = {
    server: fastify.server
  }

  if (opts.path !== undefined) {
    wsOpts.path = opts.path
  }

  const wss = new WebSocketServer(wsOpts)

  fastify.decorate('ws', wss)

  fastify.addHook('onClose', (fastify: any, done: any) => fastify.ws.close(done))

  done()

})