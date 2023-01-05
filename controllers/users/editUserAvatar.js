const getDB = require('../../db/getDB');
const { generateError, deletePhoto, savePhoto } = require('../../helpers');

const editUserAvatar = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        if (!req.files || !req.files.avatar) {
            throw generateError(
                '¡Debes indicar el nuevo avatar de usuario!',
                400
            );
        }

        const [user] = await connection.query(
            `SELECT avatar FROM user WHERE id = ?`,
            [idUserAuth]
        );

        if (user[0].avatar) {
            await deletePhoto(user[0].avatar, 0);
        }

        const avatarName = await savePhoto(req.files.avatar, 0);

        await connection.query(`UPDATE user SET avatar = ? WHERE id = ?`, [
            avatarName,
            idUserAuth,
        ]);

        res.send({
            status: 'Ok',
            message: '¡Avatar de usuario modificado con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUserAvatar;
