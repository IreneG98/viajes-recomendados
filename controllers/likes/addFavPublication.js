const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const addFavPublication = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { idPublication } = req.params;

        const [publication] = await connection.query(
            `SELECT * FROM publication WHERE id = ?`,
            [idPublication]
        );

        if (publication[0].idUser === idUserAuth) {
            throw generateError(
                'No puedes añadir a favoritos tus publicaciones',
                409
            );
        }

        const [like] = await connection.query(
            `SELECT * FROM user_like_publication WHERE idUser = ? AND idPublication = ?`,
            [idUserAuth, idPublication]
        );

        if (like.length > 0) {
            throw generateError(
                '¡Esa publicación ya consta como favorito!',
                409
            );
        }

        await connection.query(
            `INSERT INTO user_like_publication (idUser, idPublication)
            VALUES (?, ?)`,
            [idUserAuth, idPublication]
        );

        res.send({
            status: 'Ok',
            message: `¡Publicación añadida a favoritos!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addFavPublication;
