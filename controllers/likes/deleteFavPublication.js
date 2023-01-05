const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const deleteFavPublication = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { idPublication } = req.params;

        const [like] = await connection.query(
            `SELECT * FROM user_like_publication WHERE idUser = ? AND idPublication = ?`,
            [idUserAuth, idPublication]
        );

        if (like.length < 1) {
            throw generateError(
                '¡La publicación no consta como favorito!',
                404
            );
        }

        await connection.query(
            `DELETE FROM user_like_publication WHERE idUser = ? AND idPublication = ?`,
            [idUserAuth, idPublication]
        );

        res.send({
            status: 'Ok',
            message: '¡Publicación eliminada de favoritos!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteFavPublication;
