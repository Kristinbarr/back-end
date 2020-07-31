
exports.seed = async function(knex) {
   await knex('class_clients').del();
   await knex('classes').del();
   await knex('types').del();
   await knex('users').del();
   await knex('roles').del();
}