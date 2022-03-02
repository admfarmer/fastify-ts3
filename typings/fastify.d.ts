import * as knex from 'knex'
import * as jsonwebtoken from 'jsonwebtoken';
import { AxiosInstance } from 'axios';

declare module 'fastify' {
  interface FastifyInstance {
    knex: knex
    knex2: knex
    mysql: knex
    mysql2: knex
    pg: knex
    jwt: jsonwebtoken
    authenticate: any
    ws: any
    io: any
    axios: AxiosInstance | any
    qrcode: any
  }

  interface FastifyRequest {
    jwtVerify: any
    user: any
    file: any
    files: any[]
  }

}

