const knex = require('knex');

const knexfile = require('../knexfile');

const dbEnv = process.env.DATABASE_URL || 'development'

module.exports = knex(knexfile[dbEnv]);