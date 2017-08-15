import express from "express";
import consign from "consign";
import config from './libs/config.js';
import database from './libs/database.js';

database(config.database);

const app = express();

consign()
    .include('libs/config.js')
    .then('models')
    .then('libs/auth.js')
    .then('libs/middleware.js')
    .then('routes')
    .then('libs/boot.js')
    .into(app);

    module.exports = app;