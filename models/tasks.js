import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Tasks = new Schema({
    title: {
        type: String,
        required: [true, 'O título é obrigatório'],
        min: [1, 'O título é obrigatório'],
        max: 100
    },
    done: {
        type: Boolean,
        required: true,
        default: false
    },
    user: {
        id: {
            type: Schema.ObjectId,
            ref: "users",
            required: [true, 'O id do usuário é obrigatório']
        },
        name: {
            type: String,
            required: [true, 'O nome é obrigatório'],
            min: [1, 'O nome é obrigatório'],
            max: [1, 'O nome deve conter no máximo 100 caracteres'],
            trim: true
        }
    }
}, { timestamps: true });

mongoose.model('tasks', Tasks);