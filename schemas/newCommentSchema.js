const Joi = require('joi');

const newCommentSchema = Joi.object().keys({
    comment: Joi.string()
        .min(1)
        .max(500)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (errors[0].code === 'string.empty') {
                return new Error(
                    '¡El comentario debe tener entre 1 y 500 caracteres de longitud!'
                );
            }
        }),
});

module.exports = newCommentSchema;
