import mongoose, { Schema } from 'mongoose';
import mongooseHistory from 'mongoose-history';
import composeWithMongoose from 'graphql-compose-mongoose';
import { GQC } from 'graphql-compose';

const Tasks = new Schema(
  {
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
        ref: 'users',
        required: [true, 'O id do usuário é obrigatório']
        // ,
        // name: {
        //   type: String,
        //   required: [true, 'O nome é obrigatório'],
        //   min: [1, 'O nome é obrigatório'],
        //   max: [100, 'O nome deve conter no máximo 100 caracteres'],
        //   trim: true
        // }
      }
    }
  },
  { timestamps: true }
);

Tasks.plugin(mongooseHistory);

const TasksModel = mongoose.model('tasks', Tasks);

const customizationOptions = {};
const TaskTC = composeWithMongoose(TasksModel, customizationOptions);


const extendedFindMany = TaskTC.getResolver('findMany').addFilterArg({
  name: 'titleRegex',
  type: 'String',
  description: 'Full text search',
  query: (query, value, params) => {
    console.log('query', query);
    console.log('value', value);
    console.log('params', params);
    query.title = new RegExp(value, 'i');
  }
});

extendedFindMany.name = 'findMany';
TaskTC.addResolver(extendedFindMany);

GQC.rootQuery().addFields({
  taskById: TaskTC.getResolver('findById'),
  taskByIds: TaskTC.getResolver('findByIds'),
  taskOne: TaskTC.getResolver('findOne'),
  taskMany: TaskTC.getResolver('findMany'),
  taskCount: TaskTC.getResolver('count'),
  taskConnection: TaskTC.getResolver('connection'),
  taskPagination: TaskTC.getResolver('pagination')
});

GQC.rootMutation().addFields({
  taskCreate: TaskTC.getResolver('createOne'),
  taskUpdateById: TaskTC.getResolver('updateById'),
  taskUpdateOne: TaskTC.getResolver('updateOne'),
  taskUpdateMany: TaskTC.getResolver('updateMany'),
  taskRemoveById: TaskTC.getResolver('removeById'),
  taskRemoveOne: TaskTC.getResolver('removeOne'),
  taskRemoveMany: TaskTC.getResolver('removeMany')
});

module.exports = TaskTC;
