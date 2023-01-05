const getDB = require('../../db/getDB');
const { generateError, validateSchema } = require('../../helpers');
const newPublicationSchema = require('../../schemas/newPublicationSchema');

const newPublication = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        await validateSchema(newPublicationSchema, req.body);

        const { title, category, place, description, text } = req.body;

        await connection.query(
            `
            INSERT INTO publication(title, category, place, description, text, idUser)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
            [title, category, place, description, text, idUserAuth]
        );

        res.send({
            status: 'Ok',
            message: 'Publicación creado correctamente!',
            data: {
                title,
                category,
                place,
                description,
                text,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newPublication;
