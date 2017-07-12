import mongoose from 'mongoose';

mongoose.Promise = global.Promise
require('mongoose-schema-jsonschema')(mongoose)

module.exports = (uri) => {
  mongoose.connect(uri);
  mongoose.set('debug', true);
  mongoose.connection.on('connected', () => {
    console.log('Conectado ao MongoDB em', uri);
  });
  mongoose.connection.on('error', error => {
    console.log('Erro na conexão:', error);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Desconectado do MongoDB');
  });
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Aplicação terminada, conexão fechada');
      process.exit(0);
    })
  });
}