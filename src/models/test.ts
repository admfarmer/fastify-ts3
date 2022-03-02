import * as knex from 'knex';

export class TestModel {

  constructor() { }

  test(db: knex) {
    return db('users')
  }

}
