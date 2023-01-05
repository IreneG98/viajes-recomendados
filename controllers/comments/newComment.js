const getDB = require('../../db/getDB');
const { generateError, validateSchema } = require('../../helpers');
const newCommentSchema = require('../../schemas/newCommentSchema');

const newComment = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        await validateSchema(newCommentSchema, req.body);

        const { idPublication } = req.params;

        const { comment } = req.body;

        await connection.query(
            `INSERT INTO user_comment_publication (comment, idUser, idPublication)
        VALUES (?, ?, ?)`,
            [comment, idUserAuth, idPublication]
        );

        res.send({
            status: 'Ok',
            message: `¡Comentario añadido!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = newComment;
