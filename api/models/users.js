import mongoose, { Schema } from 'mongoose';
import mongooseHistory from 'mongoose-history';
import composeWithMongoose from 'graphql-compose-mongoose';
import bcrypt from 'bcrypt-nodejs';
import { GQC } from 'graphql-compose';

const SALT_WORK_FACTOR = 10;

const Users = new Schema(
  {
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
      max: [10, 'A senha deve conter no máximo 10 caracteres'],
      select: false
    },
    email: {
      type: String,
      required: [true, 'o e-mail é obrigatório'],
      min: [7, 'o e-mail deve conter no mínimo 7 caracteres'],
      max: [50, 'o e-mail deve conter no máximo 50 caracteres'],
      lowercase: true,
      unique: [true, 'Já existe um usuário cadastrado para o e-mail informado'],
      validate: {
        validator: function(value) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
        },
        message: '{VALUE} é um e-mail inválido'
      }
    }
  },
  { timestamps: true }
);

Users.plugin(mongooseHistory);

Users.pre('create', encryptPassword);
Users.pre('save', encryptPassword);

function encryptPassword(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(
      user.password,
      salt,
      () => {},
      (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      }
    );
  });
}

  const UserModel = mongoose.model('users', Users);

const options = {};
const UserTC = composeWithMongoose(UserModel, options);

UserTC.removeField('password')

GQC.rootQuery().addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userCount: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
  userPagination: UserTC.getResolver('pagination')
});

GQC.rootMutation().addFields({
  userCreate: UserTC.getResolver('createOne'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany')
});

module.exports = UserTC;
