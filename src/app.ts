import * as fastify from 'fastify'
import WebSocket from 'ws'
import { join } from 'path'

const multer = require('fastify-multer')

require('dotenv').config({ path: join(__dirname, '../config') })

const app: fastify.FastifyInstance = fastify.fastify({
  logger: { level: 'info' }
})

app.register(require('fastify-swagger'), {
  routePrefix: '/doc-swagger',
  swagger: {
    info: {
      title: 'Fastify-ts Swagger',
      description: 'Testing the Fastify swagger API',
      version: '2.6.0'
    },
    externalDocs: {
      url: 'http://localhost',
      description: 'Find more info here'
    },
    host: `${process.env.HOST}:${process.env.PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      // { name: 'user', description: 'User related end-points' },
      // { name: 'code', description: 'Code related end-points' }
    ],
    definitions: {
      User: {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: {type: 'string', format: 'email' }
        }
      }
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request:any, reply:any, next:any) { next() },
    preHandler: function (request:any, reply:any, next:any) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header:any) => header,
  exposeRoute: true
})


app.register(multer.contentParser)

app.register(require('fastify-formbody'))
app.register(require('fastify-cors'), {})
// First connection
app.register(require('./plugins/db'), {
  connectionName: 'mysql',
  options: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      port: Number(process.env.DB_PORT) || 3306,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
    },
    pool: {
      min: 0,
      max: 100
    },
    debug: true,
  }
})
// Second connection
app.register(require('./plugins/db'), {
  connectionName: 'mysql2',
  options: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      port: 3306,
      password: '789124',
      database: 'test2',
    },
    pool: {
      min: 0,
      max: 100
    },
    debug: true,
  }
})
// pg connection
app.register(require('./plugins/db'), {
  connectionName: 'pg',
  options: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      port: Number(process.env.DB_PORT) || 3306,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
    },
    pool: {
      min: 0,
      max: 100
    },
    debug: true,
  }
})

app.register(require('./plugins/jwt'), {
  secret: process.env.SECRET_KEY || '@1234567890@'
})

app.register(require('./plugins/ws'), {
  path: '/ws',
  maxPayload: 1048576,
  verifyClient: function (info: any, next: any) {
    if (info.req.headers['x-fastify-header'] !== 'fastify') {
      return next(false)
    }
    next(true)
  }
})

// Axios
app.register(require('fastify-axios'), {
  clients: {
    v1: {
      baseURL: 'https://apingweb.com/api/rest',
    },
    v2: {
      baseURL: 'https://randomuser.me/api'
    }
  }
})

// QR Code
app.register(require('@chonla/fastify-qrcode'))

app.register(require('./routes/index'), { prefix: '/' });
app.register(require('./routes/demo'), { prefix: '/demo' });
app.register(require('./routes/test'), { prefix: '/test' });
app.register(require('./routes/login'), { prefix: '/login' });

// plugins
app.register(require('./routes/upload'), { prefix: '/upload' });
app.register(require('./routes/schema'), { prefix: '/schema' });


const port = process.env.PORT || 3000
const address = process.env.HOST || '0.0.0.0'

const start = async () => {
  try {
    await app.listen(port, address)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

start()

export default app;