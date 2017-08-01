import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10

const Users = new Schema({
    name: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        min: [1, 'O nome é obrigatório'],
        max: [100, 'O nome deve conter no máximo 100 caracteres'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        min: [4, 'A senha deve conter no mínimo 4 caracteres'],
        max: [10, 'A senha deve conter no máximo 10 caracteres']
    },
    email: {
        type: String,
        required: [true, 'o e-mail é obrigatório'],
        min: [7, 'o e-mail deve conter no mínimo 7 caracteres'],
        max: [50, 'o e-mail deve conter no máximo 50 caracteres'],
        lowercase: true,
        unique: [true, 'Já existe um usuário cadastrado para o e-mail informado'],
        validate: {
            validator: function (value) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
            },
            message: '{VALUE} é um e-mail inválido'
        }
    }
}, { timestamps: true });

Users.pre('create', encryptPassword);
Users.pre('save', encryptPassword); 

function encryptPassword(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, () => {},(err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
}

mongoose.model('users', Users);