const getDB = require('../../db/getDB');
const { generateError, savePhoto } = require('../../helpers');

const addPublicationPhoto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idPublication } = req.params;

        const [photos] = await connection.query(
            `SELECT * FROM publication_photo WHERE idPublication = ?`,
            [idPublication]
        );

        if (photos.length >= 5) {
            throw generateError(
                '¡La publicación ya tiene el máximo de 5 fotos asignadas!',
                403
            );
        }

        if (!req.files || !req.files.publicationPhoto) {
            throw generateError(
                '¡Debes indicar una nueva foto de publicación!',
                400
            );
        }

        const photoName = await savePhoto(req.files.publicationPhoto, 1);

        await connection.query(
            `INSERT INTO publication_photo (name, idPublication)
            VALUES (?, ?)`,
            [photoName, idPublication]
        );

        res.send({
            status: 'Ok',
            message: '¡Foto de publicación añadida con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addPublicationPhoto;
