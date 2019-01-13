var mongoose = require('mongoose');
var uniquieValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


var usuarioSchema = new Schema({

    nombre: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique: true, required: [true, 'El correo es necesario']},
    password: {type: String, required: [true, 'La constraseña es necesario']},
    img: {type: String, required: false},
    role: {type: String, required: false, default: 'USER_ROLE',enum: rolesValidos},
});
usuarioSchema.plugin(uniquieValidator, {message: 'El {PATH} debe ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
