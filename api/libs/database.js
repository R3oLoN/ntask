import mongoose from 'mongoose';
import config from './config.js';

mongoose.Promise = global.Promise
require('mongoose-schema-jsonschema')(mongoose)

module.exports = (uri) => {
  mongoose.connection.openUri(uri);
  mongoose.set('debug', config.logging);
  mongoose.connection.on('connected', () => {
    if(config.logging) console.log('Conectado ao MongoDB em', uri);
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