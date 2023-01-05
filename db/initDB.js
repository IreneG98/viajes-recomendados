const getDB = require('./getDB');
const bcrypt = require('bcrypt');
async function main() {
    let connection;

    try {
        connection = await getDB();

        console.log('Eliminando tablas en caso que existan...');

        await connection.query(`DROP TABLE IF EXISTS user_like_publication`);
        await connection.query(`DROP TABLE IF EXISTS publication_photo`);
        await connection.query(`DROP TABLE IF EXISTS publication`);
        await connection.query(`DROP TABLE IF EXISTS user`);

        console.log('¡Tablas eliminadas!');

        console.log('Creando tablas...');

        await connection.query(
            `CREATE TABLE IF NOT EXISTS user (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(100) NOT NULL,
                name VARCHAR(50),
                lastname VARCHAR(100),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                avatar VARCHAR(255)
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS publication (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(100) NOT NULL,
                category ENUM('Nieve', 'Playa', 'Ciudad', 'Montaña', 'Crucero', 'Interrail', 'Senderismo', 'Relax') NOT NULL,
                place VARCHAR(100) NOT NULL,
                description VARCHAR(500) NOT NULL,
                text VARCHAR(500) NOT NULL,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id)
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS publication_photo(
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                idPublication INT UNSIGNED NOT NULL,
                FOREIGN KEY (idPublication) REFERENCES publication(id)
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS user_like_publication(
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                idPublication INT UNSIGNED NOT NULL,
                addDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idUser) REFERENCES user (id),
                FOREIGN KEY (idPublication) REFERENCES publication (id)
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS user_comment_publication(
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                comment VARCHAR(500) NOT NULL,
                idUser INT UNSIGNED NOT NULL,
                idPublication INT UNSIGNED NOT NULL,
                addDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idUser) REFERENCES user (id),
                FOREIGN KEY (idPublication) REFERENCES publication (id)
            )`
        );

        console.log('¡Tablas creadas!');

        console.log('Insertando unos datos de prueba...');

        await connection.query(
            `INSERT INTO user (username, email, password)
             VALUES ('userPrueba', 'prueba@gmail.com', '${await bcrypt.hash(
                 '123',
                 10
             )}')`
        );

        await connection.query(
            `INSERT INTO publication(title, category, place, description, text, idUser)
            VALUES ('Escapada rural', 'Montaña', 'Ronda', 'Escapada tranquila en la Serranía de Ronda', 'Ronda se encontraba en un enclave estratégico muy importante en la época de la conquista musulmana de España. Es por esta razón que Ronda está rodeada de inexpugnables murallas. Hoy en día, sirven para recordar el pasado defensivo de la ciudad.', 1),
            ('Ciudad cosmopolita', 'Ciudad', 'Valencia', 'Visita a la ciudad de las artes y de las ciencias de Valencia', 'En 1989 el entonces presidente de la Generalidad Valenciana, Joan Lerma, tras una visita a la Cité des sciences et de la industrie, de París, y a través del entonces director general de planificación y estudios de la Presidencia de la Generalidad Valenciana, José María Bernabé, encargó oficialmente al científico Antonio Ten Ros, la redacción de una primera propuesta de una Ciudad de la Ciencia y la Tecnología para Valencia.', 1),
            ('Unas playas paradisiacas', 'Playa', 'Menorca', 'Semana maravillosa en las mejores playas de España', 'Las playas y calas de Menorca son casi ilimitadas y cada viajero te hablará de sus favoritas. Aquí te proponemos las que nosotros consideramos que son las mejores calas y playas de Menorca.', 1)`
        );

        console.log('¡Datos de prueba insertados con éxito!');
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

main();
