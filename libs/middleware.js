import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

module.exports = app => {
	app.set('port', 3000);
	if (!process.env.NODE_ENV) {
		app.set('json spaces', 4);
	}
	app.use(cors({
		origin: ['http://localhost:3001'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization']
	}));
	app.use(bodyParser.json());
	app.use(app.libs.auth.initialize());
	app.use(express.static('public'));
}