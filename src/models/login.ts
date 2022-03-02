import * as knex from 'knex';

export class LoginModel {

  constructor() { }

  login(db: knex, username: any, password: any) {
    return db('users')
      .select('user_id', 'first_name', 'last_name')
      .where('username', username)
      .where('password', password)
  }

}
