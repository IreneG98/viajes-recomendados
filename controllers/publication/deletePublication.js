const getDB = require('../../db/getDB');
const { deletePhoto } = require('../../helpers');

const deletePublication = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idPublication } = req.params;

        const [photos] = await connection.query(
            `SELECT name FROM publication_photo WHERE idPublication = ?`,
            [idPublication]
        );

        for (let i = 0; i < photos.length; i++) {
            await deletePhoto(photos[i].name, 1);
        }

        await connection.query(
            `DELETE FROM publication_photo WHERE idPublication = ?`,
            [idPublication]
        );

        await connection.query(`DELETE FROM publication WHERE id = ?`, [
            idPublication,
        ]);

        res.send({
            status: 'Ok',
            message: '¡Publicación eliminada con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deletePublication;
