const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const newUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            throw generateError('Faltan datos obligatorios.', 400);
        }

        const [userMail] = await connection.query(
            `SELECT id FROM user WHERE email = ?`,
            [email]
        );

        if (userMail.length > 0) {
            throw generateError(
                'Ya existe un usuario con ese email en la base de datos',
                409
            );
        }

        const [userName] = await connection.query(
            `SELECT id FROM user WHERE username = ?`,
            [username]
        );

        if (userName.length > 0) {
            throw generateError(
                `${username} ya existe en la base de datos`,
                409
            );
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await connection.query(
            `INSERT INTO user (username, email, password)
            VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );

        res.send({
            status: 'Ok',
            message: '¡Usuario registrado con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newUser;
