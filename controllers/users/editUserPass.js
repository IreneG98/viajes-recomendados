const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');

let saltRounds = 10;

const editUserPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { email, newPass, confirmNewPass } = req.body;

        if (!email || !newPass || !confirmNewPass) {
            throw generateError('¡Faltan datos obligatorios!', 400);
        }

        if (newPass !== confirmNewPass) {
            throw generateError('¡Las contraseñas no coinciden!', 401);
        }

        const [user] = await connection.query(
            `SELECT email FROM user WHERE id = ?`,
            [idUserAuth]
        );

        if (email !== user[0].email) {
            throw generateError(
                '¡El email debe coincidir con el usuario que ha hecho login!',
                401
            );
        }

        const hashedPassword = await bcrypt.hash(newPass, saltRounds);

        await connection.query(`UPDATE user SET password = ? WHERE id = ?`, [
            hashedPassword,
            idUserAuth,
        ]);

        res.send({
            status: 'Ok',
            message: '¡Contraseña actualizada con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUserPass;
