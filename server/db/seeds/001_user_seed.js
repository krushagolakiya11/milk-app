const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
    await knex('users').del();

    const hashedPassword = await bcrypt.hash('password123', 10);

    await knex('users').insert([
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword
        }
    ])
}