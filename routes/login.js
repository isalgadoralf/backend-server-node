var express = require('express');
// para encriptado
var bcrypt = require('bcryptjs');
//jwt
var jwt = require('jsonwebtoken');

var app = express();

//impoart schemas

var Usuario = require('../models/usuario');

app.post('/', ( req, res )=> {

    var body = req.body;
    Usuario.findOne({ email: body.email },( error,usuarioDB) =>{

        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: error
            });
        }

        if( !bcrypt.compareSync( body.password,usuarioDB.password) ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: error
            });
        }
        //Crear un token!
        usuarioDB.password = '*******';
        var token = jwt.sign({usuario:usuarioDB},'hola' ,{ expiresIn:14400 }); // 4 horas



        res.status(200).json({
            ok: true,
            usuario : usuarioDB,
            token:token,
            id: usuarioDB._id
        });

    })


});


module.exports = app;
