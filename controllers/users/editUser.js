const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const editUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { newEmail, newUsername } = req.body;

        if (!newEmail && !newUsername) {
            throw generateError(
                '¡Si no vas a modificar nah pa que tocas!',
                400
            );
        }

        const [user] = await connection.query(
            `SELECT * FROM user WHERE email = ? OR username = ?`,
            [newEmail, newUsername]
        );

        if (user.length > 0) {
            throw generateError(
                'El nuevo email o nuevo username ya están en uso.',
                409
            );
        }

        const [userAuth] = await connection.query(
            `SELECT email, username FROM user WHERE id = ?`,
            [idUserAuth]
        );

        await connection.query(
            `UPDATE user SET email = ?, username = ? WHERE id = ?`,
            [
                newEmail || userAuth[0].email,
                newUsername || userAuth[0].username,
                idUserAuth,
            ]
        );

        res.send({
            status: 'Ok',
            message: `¡Datos del usuario modificados con éxito!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUser;
