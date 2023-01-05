const getDB = require('../../db/getDB');

const listPublications = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { search, order, direction } = req.query;

        const validOrderOptions = ['place', 'category', 'likes'];

        const validDirectionOptions = ['ASC', 'DESC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'likes';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        let publications;

        if (search) {
            [publications] = await connection.query(
                `SELECT * FROM publication
                WHERE category = ? OR place LIKE ?
                 ORDER BY ${orderBy} ${orderDirection}`,
                [`%${search}%`]
            );
        } else {
            [publications] = await connection.query(
                `SELECT * FROM publication
                ORDER BY ${orderBy} ${orderDirection}`
            );
        }

        const data = [];

        for (let i = 0; i < publications.length; i++) {
            const [photos] = await connection.query(
                `SELECT id, name FROM publication_photo
                WHERE idPublication = ?`,
                [publications[i].id]
            );

            data.push({
                ...publications[i],
                photos,
            });
        }

        res.send({
            status: 'Ok',
            message: '¡Lista de publicaciones!',
            publications: data,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listPublications;
