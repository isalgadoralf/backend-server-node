var express = require('express');
// para encriptado
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();

var madAutenticacion = require('../middlewares/autentication');
//impoart schemas
var Usuario = require('../models/usuario');

// ========================================================
// Obtener todos los usuarios
// ========================================================
app.get('/', (req, res, next) => {

    // busca todos pero con filtro
    Usuario.find({}, 'nombre email img role')
        .exec(
            (error, usuarios) => {

                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: error
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios
                });
            });

});


// ========================================================
// Crear usuario
// ========================================================
app.post('/', madAutenticacion.verificaToken ,  (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });


});

// ========================================================
// Actualizar usuario
// ========================================================
app.put('/:id',  madAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (error, usuario) => {


        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.rol = body.role;

        usuario.save((error, usuarioGuardado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                });
            }
            usuarioGuardado.password = '*****';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });


});


// ========================================================
// Delete usuario por id
// ========================================================

app.delete('/:id',  madAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: error
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

});
module.exports = app;
