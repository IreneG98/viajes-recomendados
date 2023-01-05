const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const cors = require('cors');

// Creamos el servidor
const app = express();

// Middleware para cors
app.use(cors());

// Deserializamos el body en formato raw
app.use(express.json());

// Middleware de Morgan para obtener más información sobre cada una de las peticiones
app.use(morgan('dev'));

// Middleware para leer el body en formato form-data (para leer archivos e imágenes)
// instalación -> npm i express-fileupload
app.use(fileUpload());

/* 
    ###################
    ### Middlewares ###
    ###################
*/
const isAuth = require('./middlewares/isAuth');
const canEditPublication = require('./middlewares/canEditPublication');

/* 
    #################################
    ### Controladores de Usuarios ###
    #################################
*/
const newUser = require('./controllers/users/newUser');
const loginUser = require('./controllers/users/loginUser');
const editUser = require('./controllers/users/editUser');
const editUserPass = require('./controllers/users/editUserPass');
const editUserAvatar = require('./controllers/users/editUserAvatar');

/* 
    ##########################
    ### Endpoints Usuarios ###
    ##########################
*/
// Registro de usuario
app.post('/register', newUser);

// Login de usuario
app.post('/login', loginUser);

// Modificar email o username
app.put('/users', isAuth, editUser);

// Modificar la contraseña del usuario
app.put('/users/password', isAuth, editUserPass);

// Modificar avatar del usuario
app.put('/users/avatar', isAuth, editUserAvatar);

/* 
    ##################################
    ### Controladores de publicaiones ###
    ##################################
*/
const listPublications = require('./controllers/publication/listPublications');
const getPublication = require('./controllers/publication/getPublication');
const newPublication = require('./controllers/publication/newPublication');
const addPublicationPhoto = require('./controllers/publication/addPublicationPhoto');
const deletePublication = require('./controllers/publication/deletePublication');

/* 
    ##############################
    ### Endpoints de publicaciones ###
    ##############################
*/

// Listar las publicaciones
app.get('/publications', listPublications);
// Devolver info de una publicación
app.get('/publications/:idPublication', getPublication);
// Inserta una nueva publicación
app.post('/publication/new', isAuth, newPublication);
// Añadir nueva foto de publicación
app.post(
    '/publications/:idPublication/photo',
    isAuth,
    canEditPublication,
    addPublicationPhoto
);
// Eliminar una publicación
app.delete(
    '/publications/:idPublication',
    isAuth,
    canEditPublication,
    deletePublication
);

/* 
    ##############################
    ### Controladores de likes ###
    ##############################
*/
const addFavPublication = require('./controllers/likes/addFavPublication');
const deleteFavPublication = require('./controllers/likes/deleteFavPublication');

/* 
    ##########################
    ### Endpoints de likes ###
    ##########################
*/

// Añadir una publicación a favoritos
app.post('/publications/:idPublication/like', isAuth, addFavPublication);

// Eliminar una publicación de favoritos
app.delete('/publications/:idPublication/like', isAuth, deleteFavPublication);

/* 
    ####################################
    ### Controladores de Comentarios ###
    ####################################
*/
const newComment = require('./controllers/comments/newComment');
/* 
    ################################
    ### Endpoints de Comentarios ###
    ################################
*/
app.post('/publications/:idPublication/comment', isAuth, newComment);

// Middleware de Error
app.use((error, req, res, _) => {
    console.error(error);
    // Establecemos el codigo del error
    res.status(error.httpStatus || 500);

    // Respondemos
    res.send({
        status: 'Error',
        message: error.message,
    });
});

// Middleware de Not Found
app.use((req, res) => {
    // Establecemos el codigo de error 404
    res.status(404);

    // Respondemos
    res.send({
        status: 'Error',
        message: 'Not found',
    });
});

// Ponemos el servidor a la escucha
app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
