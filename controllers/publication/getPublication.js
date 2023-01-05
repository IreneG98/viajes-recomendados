const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const getPublication = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idPublication } = req.params;

        const [publication] = await connection.query(
            `SELECT *,
            COUNT(idPublication) as likes
            FROM publication p
            JOIN user_like_publication u
            ON p.id = u.idPublication
            WHERE idPublication = ?;`,
            [idPublication]
        );

        if (publication.length < 1) {
            throw generateError(
                `La publicación con id ${idUser} no existe.`,
                404
            );
        }

        const responseUser = {
            title: publication[0].title,
            category: publication[0].category,
            place: publication[0].place,
            description: publication[0].description,
            text: publication[0].text,
            photo: publication[0].photo || '',
            likes: publication[0].likes || '0',
        };

        res.send({
            status: 'Ok',
            publication: responseUser,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getPublication;
