const { unlink } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

const avatarDir = path.join(__dirname, 'static', 'avatar');

const publicationDir = path.join(__dirname, 'static', 'publication');

function generateError(message, code) {
    const error = new Error(message);
    error.httpStatus = code;
    return error;
}

async function deletePhoto(photoName, type) {
    try {
        let photoPath;
        if (type === 0) {
            photoPath = path.join(avatarDir, photoName);
        } else if (type === 1) {
            photoPath = path.join(publicationDir, photoName);
        }

        await unlink(photoPath);
    } catch (error) {
        throw new Error('¡Error al procesar la imagen del servidor!');
    }
}

async function savePhoto(imagen, type) {
    try {
        const sharpImage = sharp(imagen.data);

        let photoPath;

        const imageName = uuid.v4() + '.jpg';

        if (type === 0) {
            photoPath = path.join(avatarDir, imageName);

            sharpImage.resize(150, 150);
        } else if (type === 1) {
            photoPath = path.join(publicationDir, imageName);
        }

        sharpImage.toFile(photoPath);

        return imageName;
    } catch (error) {
        throw new Error('¡Ha ocurrido un error al procesar la imagen!');
    }
}

async function validateSchema(schema, data) {
    try {
        await schema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}

module.exports = {
    generateError,
    deletePhoto,
    savePhoto,
    validateSchema,
};
