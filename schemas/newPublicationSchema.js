const Joi = require('joi');

const newPublicationSchema = Joi.object().keys({
    title: Joi.string()
        .required()
        .min(10)
        .max(100)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El título es requerido!');
            } else {
                return new Error(
                    '¡El título debe tener entre 10 y 100 caracteres de longitud!'
                );
            }
        }),

    category: Joi.string()
        .min(1)
        .max(500)
        .error((errors) => {
            if (errors[0].code === 'string.empty') {
                return new Error('¡La categoría es requerido!');
            } else {
                return new Error(
                    '¡La categoría debe tener entre 10 y 100 caracteres de longitud!'
                );
            }
        }),

    place: Joi.string()
        .min(3)
        .max(500)
        .error((errors) => {
            if (errors[0].code === 'string.empty') {
                return new Error('¡El lugar es requerido!');
            } else {
                return new Error(
                    '¡El lugar debe tener entre 10 y 100 caracteres de longitud!'
                );
            }
        }),
    description: Joi.string()
        .min(10)
        .max(300)
        .error((errors) => {
            if (errors[0].code === 'string.empty') {
                return new Error(
                    '¡No se permite enviar una descripción vacía!'
                );
            } else {
                return new Error(
                    '¡La descripción debe tener entre 10 y 500 caracteres como máximo!'
                );
            }
        }),

    text: Joi.string()
        .min(10)
        .max(500)
        .error((errors) => {
            if (errors[0].code === 'string.empty') {
                return new Error('¡No se permite enviar un texto vacío!');
            } else {
                return new Error(
                    '¡El texto debe tener entre 10 y 500 caracteres como máximo!'
                );
            }
        }),
});

module.exports = newPublicationSchema;
