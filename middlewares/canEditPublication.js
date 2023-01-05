const getDB = require('../db/getDB');
const { generateError } = require('../helpers');

const canEditPublication = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { idPublication } = req.params;

        const [publication] = await connection.query(
            `SELECT * FROM publication WHERE id = ? AND idUser = ?`,
            [idPublication, idUserAuth]
        );

        if (publication.length < 1) {
            throw generateError(
                '¡No eres el propietario de la publicación que se intenta editar!',
                401
            );
        }

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = canEditPublication;
