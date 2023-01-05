const getDB = require('../db/getDB');
const { generateError } = require('../helpers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { authorization } = req.headers;

        if (!authorization) {
            throw generateError('¡Falta la cabecera de autorización!', 401);
        }

        let tokenInfo;

        try {
            // Desencriptamos el token
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            throw generateError('¡El token no es válido!', 401);
        }

        const [user] = await connection.query(
            `SELECT * FROM user WHERE id = ?`,
            [tokenInfo.id]
        );

        if (user.length < 1) {
            throw generateError('¡El token no es válido!', 401);
        }

        req.userAuth = tokenInfo;

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = isAuth;
