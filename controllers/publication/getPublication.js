const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const getPublication = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idPublication } = req.params;

        const [publications] = await connection.query(
            `SELECT p.*,
            COUNT(u.id) as likes
            FROM publication p
            left JOIN user_like_publication u
            ON p.id = u.idPublication
            WHERE p.id = ?;`,
            [idPublication]
        );

        if (publications.length < 1) {
            throw generateError(
                `La publicación con id ${idUser} no existe.`,
                404
            );
        }

        const [photos] = await connection.query(
            `SELECT id, name FROM publication_photo
            WHERE idPublication = ?`,
            [publications[0].id]
        );

        const [comments] = await connection.query(
            `SELECT idUser, comment FROM user_comment_publication
            WHERE idPublication = ?`,
            [publications[0].id]
        );

        const publication = { ...publications[0], photos, comments };

        res.send({
            status: 'Ok',
            publication,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getPublication;
