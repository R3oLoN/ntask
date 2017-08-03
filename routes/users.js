import mongoose from 'mongoose';

module.exports = app => {
	const Users = mongoose.model('users');

	app.route('/users')
		.all(app.libs.auth.authenticate())
        /**
        * @api {get} /users Exibe usuários cadastrados
        * @apiGroup Usuários
        * @apiHeader {String} Authorization Token de usuário
        * @apiHeaderExample {json} Entrada
        *   {Authorization: 'JWT xyz.abc.123.hgf'}
        * @apiSuccess {Object[]} users Lista de usuários
        * @apiSuccess {String} _id Id de registro
        * @apiSuccess {String} name Nome
        * @apiSuccess {String} email Email
        * @apiSuccess {Date} createdAt Data de cadastro
        * @apiSuccess {Date} updatedAt Data de alteração
        * @apiSuccessExample {json} Sucesso
        *  HTTP/1.1 200 Ok
        *  [
        *	{
        *		"_id": "597b78ce4441fe0f74b5db79",
        *		"updatedAt": "2017-07-28T22:47:58.397Z",
        *		"createdAt": "2017-07-28T22:47:58.397Z",
        *		"name": "Leandro Reolon",
        *		"email": "leandroreolon@gmail.com"
        *	}
        * ]
        * @apiErrorExample {json} Erro de consulta
        *  HTTP/1.1 400 Bad request
        * @apiVersion 1.0.0
        */
		.get((req, res) => {
			Users.find({})
				.exec((err, users) => {
					if (err) {
						res.status(400).json(err);
						return;
					}
					res.json(users);
				});
		})
        /**
        * @api {post} /users Cadastrar novos usuários
        * @apiGroup Usuários
        * @apiParam {String} name       Nome
        * @apiParam {String} email      Email
        * @apiParam {String} password   Senha
        * @apiParamExample {json} Entrada
        *   {
        *   	"name": "Leandro Reolon",
        *   	"email": "leandroreolon@gmail.com",
        *   	"password": "123456"
        *   }
        * @apiSuccess {String}  _id         Id de registro
        * @apiSuccess {String}  name        Nome
        * @apiSuccess {String}  email       Email
        * @apiSuccess {Date}    createdAt   Data de cadastro
        * @apiSuccess {Date}    updatedAt   Data de alteração
        * @apiSuccessExample {json} Sucesso
        *   HTTP/1.1 200 Ok
        *   {
        *   	"_id": "59833dbbd402200892b583e8",
        *   	"updatedAt": "2017-08-03T22:14:03.110Z",
        *   	"createdAt": "2017-08-03T22:14:03.110Z",
        *   	"name": "Leandro Reolon",
        *   	"email": "leandroreolon@gmail.com"
        *   }
        * @apiErrorExample {json} Erro no cadastro
        *  HTTP/1.1 400 Bad request
        * @apiVersion 1.0.0
        */
		.post((req, res) => {
			Users.create(req.body, (err, user) => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				Users.findOne({ _id: user.id }, (err, user) => {
					if (err) {
						res.status(400).json(err);
						return;
					}
					res.json(user);
				});
			});
		});

	app.route('/user')
		.all(app.libs.auth.authenticate())
        /**
        * @api {get} /user Exibe os dados do usuário logado
        * @apiGroup Usuários
        * @apiHeader {String} Authorization Token de usuário
        * @apiHeaderExample {json} Entrada
        *   {Authorization: 'JWT xyz.abc.123.hgf'}
        * @apiSuccess {String} _id Id de registro
        * @apiSuccess {String} name Nome
        * @apiSuccess {String} email Email
        * @apiSuccess {Date} createdAt Data de cadastro
        * @apiSuccess {Date} updatedAt Data de alteração
        * @apiSuccessExample {json} Sucesso
        *	HTTP/1.1 200 Ok
        *	{
        *		"_id": "597b78ce4441fe0f74b5db79",
        *		"updatedAt": "2017-07-28T20:47:58.397Z",
        *		"createdAt": "2017-07-28T20:47:58.397Z",
        *		"name": "Leandro Reolon",
        *		"email": "leandroreolon@gmail.com"
        *	}
        * @apiErrorExample {json} Erro de consulta
        *  HTTP/1.1 400 Bad request
        * @apiVersion 1.0.0
        */
		.get((req, res) => {
			const user = req.user;
			Users.findOne({ _id: user.id }, (err, user) => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				res.json(user);
			});
		})
        /**
        * @api {put} /user Altera os dados do usuário logado
        * @apiGroup Usuários
        * @apiParam {String} [name]		Nome
        * @apiParam {String} [email]	Email
        * @apiParam {String} [password]	Senha
        * @apiParamExample {json} Entrada
        *   {
        *   	"name": "Leandro Reolon",
        *   	"email": "leandroreolon@gmail.com",
        *   	"password": "123456"
        *   }
        * @apiSuccess {String}  _id         Id de registro
        * @apiSuccess {String}  name        Nome
        * @apiSuccess {String}  email       Email
        * @apiSuccess {Date}    createdAt   Data de cadastro
        * @apiSuccess {Date}    updatedAt   Data de alteração
        * @apiSuccessExample {json} Sucesso
        *   HTTP/1.1 200 Ok
        *   {
        *   	"_id": "597b78ce4441fe0f74b5db79",
        *   	"updatedAt": "2017-08-03T20:11:11.517Z",
        *   	"createdAt": "2017-07-28T21:47:58.397Z",
        *   	"name": "Leandro Reolon",
        *   	"email": "leandroreolon@gmail.com"
        *   }
        * @apiErrorExample {json} Erro no cadastro
		*  HTTP/1.1 400 Bad request
        * @apiVersion 1.0.0
        */
		.put((req, res) => {
			const user = req.user;
			Users.findOne({ _id: user.id }, (err, user) => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				if (!user) {
					res.status(400).json({
						id: user.id,
						error: "Registro não encontrado"
					});
					return;
				}
				user.set(req.body);
				user.save()
					.then(updated => {
						Users.findOne({ _id: updated.id }, (err, user) => {
							if (err) {
								res.status(400).json(err);
								return;
							}
							res.json(user);
						});
					})
					.catch(err => {
						res.status(400).json(err);
					});
			});
		})
		/**
        * @api {delete} /user Exclui o usuário logado
        * @apiGroup Usuários
        * @apiHeader {String} Authorization Token de usuário
        * @apiHeaderExample {json} Entrada
        *	{Authorization: 'JWT xyz.abc.123.hgf'}
        * @apiSuccessExample {json} Sucesso
        *	HTTP/1.1 204 No Content
        * @apiErrorExample {json} Erro de consulta
        *	HTTP/1.1 400 Bad request
        * @apiVersion 1.0.0
        */
		.delete((req, res) => {
			const user = req.user;
			Users.remove({ _id: user.id }, err => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				res.sendStatus(204);
			});
		});
}
