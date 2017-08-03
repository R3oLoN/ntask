import mongoose from 'mongoose';

module.exports = app => {
	const Tasks = mongoose.model('tasks');

	app.route('/tasks')
		.all(app.libs.auth.authenticate())
		/**
		* @api {get} /tasks Lista tarefas
		* @apiDescription Lista as tarefas do usuário logado
		* @apiGroup Tarefas
		* @apiHeader {String} Authorization Token de usuário
		* @apiHeaderExample {json} Entrada
		*	{Authorization: 'JWT xyz.abc.123.hgf'}
		* @apiSuccess {Object[]} tasks Lista de tarefas
		* @apiSuccess {String} tasks._id Id da tarefa
		* @apiSuccess {String} tasks.title Título da tarefa
		* @apiSuccess {Boolean} tasks.done Indica se a tarefa foi concluida
		* @apiSuccess {Date} tasks.createdAt Data de cadastro
		* @apiSuccess {Date} tasks.updatedAt Data de alteração
		* @apiSuccess {Object} tasks.user Usuário que cadastrou a tarefa
		* @apiSuccess {String} tasks.user.id Id do usuário
		* @apiSuccess {Object} tasks.user.name Nome do usuário
		* @apiSuccessExample {json} Sucesso
		*	HTTP/1.1 200 Ok
		*	[
		*		{
		*			"_id": "5980840dc5771143922be6f1",
		*			"updatedAt": "2017-08-01T23:37:17.327Z",
		*			"createdAt": "2017-08-01T23:37:17.327Z",
		*			"title": "Estudar",
		*			"user": {
		*				"id": "597b78ce4441fe0f74b5db79",
		*				"name": "Leandro Reolon"
		*			},
		*			"done": false
		*		},
		*		{
		*			"_id": "59835dc8469aca4237fd5c12",
		*			"updatedAt": "2017-08-03T22:32:48.107Z",
		*			"createdAt": "2017-08-03T22:30:48.107Z",
		*			"title": "Fazer compras",
		*			"user": {
		*				"id": "597b78ce4441fe0f74b5db79",
		*				"name": "Leandro Reolon"
		*			},
		*			"done": true
		*		}
		*	]
		* @apiErrorExample {json} Erro de consulta
		*	HTTP/1.1 400 Bad request
		* @apiVersion 1.0.0
		*/
		.get((req, res) => {
			const user = req.user;
			Tasks.find({ 'user.id': user.id })
				.exec((err, tasks) => {
					if (err) {
						res.status(400).json(err);
						return;
					}
					res.json(tasks);
				});
		})
		/**
		* @api {post} /tasks Cadastrar tarefas
		* @apiDescription Cadastra tarefas para o usuário logado
		* @apiGroup Tarefas
		* @apiHeader {String} Authorization Token de usuário
		* @apiHeaderExample {json} Entrada
		*	{Authorization: 'JWT xyz.abc.123.hgf'}
		* @apiParam {String{1..100}} title Título da tarefa
		* @apiParam	{Boolean} [done=false] Indica se a tarefa foi concluida
		* @apiParamExample {json} Entrada
		*	{
		*		title: 'Tarefa'
		*	}
		* @apiSuccess {String} _id Id da tarefa
		* @apiSuccess {String} title Título da tarefa
		* @apiSuccess {Boolean} done Indica se a tarefa foi concluida
		* @apiSuccess {Date} createdAt Data de cadastro
		* @apiSuccess {Date} updatedAt Data de alteração
		* @apiSuccess {Object} user Usuário que cadastrou a tarefa
		* @apiSuccess {String} user.id Id do usuário
		* @apiSuccess {Object} user.name Nome do usuário
		* @apiSuccessExample {json} Sucesso
		*	HTTP/1.1 200 Ok
		*	{
		*		"updatedAt": "2017-08-03T21:51:29.712Z",
		*		"createdAt": "2017-08-03T21:51:29.712Z",
		*		"title": "Tarefa",
		*		"_id": "598362a1c4dd4a4f78949880",
		*		"user": {
		*			"id": "597b78ce4441fe0f74b5db79",
		*			"name": "Leandro Reolon"
		*		},
		*		"done": false
		*	}
		* @apiErrorExample {json} Titúlo obrigatório
		*		HTTP/1.1 400 Bad request
		*		{
		*			"errors": {
		*				"title": {
		*					"message": "O título é obrigatório",
		*					"name": "ValidatorError",
		*					"properties": {
		*						"type": "required",
		*						"message": "O título é obrigatório",
		*						"path": "title",
		*						"value": ""
		*					},
		*					"kind": "required",
		*					"path": "title",
		*					"value": "",
		*					"$isValidatorError": true
		*				}
		*			},
		*			"_message": "tasks validation failed",
		*			"message": "tasks validation failed: title: O título é obrigatório",
		*			"name": "ValidationError"
		*		}
		* @apiErrorExample {json} Erro de cadastro
		*		HTTP/1.1 400 Bad request
		* @apiVersion 1.0.0
		*/
		.post((req, res) => {
			const user = req.user;
			req.body.user = {
				id: user.id,
				name: user.name
			}
			Tasks.create(req.body, (err, task) => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				res.json(task);
			});
		});

	app.route('/task/:id')
		.all(app.libs.auth.authenticate())
		/**
		* @api {get} /task:id Exibir uma tarefa
		* @apiDescription Exibe a tarefa do id informado
		* @apiGroup Tarefas
		* @apiHeader {String} Authorization Token de usuário
		* @apiHeaderExample {json} Entrada
		*	{Authorization: 'JWT xyz.abc.123.hgf'}
		* @apiParam {String} id Id da tarefa
		* @apiSuccess {String} _id Id da tarefa
		* @apiSuccess {String} title Título da tarefa
		* @apiSuccess {Boolean} done Indica se a tarefa foi concluida
		* @apiSuccess {Date} createdAt Data de cadastro
		* @apiSuccess {Date} updatedAt Data de alteração
		* @apiSuccess {Object} user Usuário que cadastrou a tarefa
		* @apiSuccess {String} user.id Id do usuário
		* @apiSuccess {Object} user.name Nome do usuário
		* @apiSuccessExample {json} Sucesso
		*	HTTP/1.1 200 Ok
		*	{
		*		"_id": "5980840dc5771143922be6f1",
		*		"updatedAt": "2017-08-01T23:37:17.327Z",
		*		"createdAt": "2017-08-01T23:37:17.327Z",
		*		"title": "Estudar",
		*		"user": {
		*			"id": "597b78ce4441fe0f74b5db79",
		*			"name": "Leandro Reolon"
		*		},
		*		"done": false
		*	}
		* @apiErrorExample {json} Erro de consulta
		*	HTTP/1.1 400 Bad request
		* @apiVersion 1.0.0
		*/
		.get((req, res) => {
			const user = req.user;
			Tasks.findOne({ _id: req.params.id, 'user.id': user.id }, (err, task) => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				if (!task) {
					res.status(404).json({
						id: req.params.id,
						error: "Registro não encontrado"
					});
					return;
				}
				res.json(task);
			});
		})
		/**
		* @api {post} /task/:id Alterar uma tarefa
		* @apiGroup Tarefas
		* @apiHeader {String} Authorization Token de usuário
		* @apiHeaderExample {json} Entrada
		*	{Authorization: 'JWT xyz.abc.123.hgf'}
		* @apiParam {String} id Id da tarefa
		* @apiParam {String{1..100}} title Título da tarefa
		* @apiParam	{Boolean} [done=false] Indica se a tarefa foi concluida
		* @apiParamExample {json} Entrada
		*	{
		*		done: true
		*	}
		* @apiSuccess {String} _id Id da tarefa
		* @apiSuccess {String} title Título da tarefa
		* @apiSuccess {Boolean} done Indica se a tarefa foi concluida
		* @apiSuccess {Date} createdAt Data de cadastro
		* @apiSuccess {Date} updatedAt Data de alteração
		* @apiSuccess {Object} user Usuário que cadastrou a tarefa
		* @apiSuccess {String} user.id Id do usuário
		* @apiSuccess {Object} user.name Nome do usuário
		* @apiSuccessExample {json} Sucesso
		*	HTTP/1.1 200 Ok
		*	{
		*		"updatedAt": "2017-08-03T23:02:51.970Z",
		*		"createdAt": "2017-08-03T22:51:29.712Z",
		*		"title": "Tarefa",
		*		"_id": "598362a1c4dd4a4f78949880",
		*		"user": {
		*			"id": "597b78ce4441fe0f74b5db79",
		*			"name": "Leandro Reolon"
		*		},
		*		"done": true
		*	}
		* @apiErrorExample {json} Titúlo obrigatório
		*		HTTP/1.1 400 Bad request
		*		{
		*			"errors": {
		*				"title": {
		*					"message": "O título é obrigatório",
		*					"name": "ValidatorError",
		*					"properties": {
		*						"type": "required",
		*						"message": "O título é obrigatório",
		*						"path": "title",
		*						"value": ""
		*					},
		*					"kind": "required",
		*					"path": "title",
		*					"value": "",
		*					"$isValidatorError": true
		*				}
		*			},
		*			"_message": "tasks validation failed",
		*			"message": "tasks validation failed: title: O título é obrigatório",
		*			"name": "ValidationError"
		*		}
		* @apiErrorExample {json} Erro de cadastro
		*		HTTP/1.1 400 Bad request
		* @apiVersion 1.0.0
		*/
		.put((req, res) => {
			const user = req.user;
			Tasks.findOne({ _id: req.params.id, 'user.id': user.id }, (err, task) => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				if (!task) {
					res.status(400).json({
						id: req.params.id,
						error: "Registro não encontrado"
					});
					return;
				}
				task.set(req.body);
				task.save()
					.then(updated => {
						res.json(updated);
					})
					.catch(err => {
						res.status(400).json(err);
					});
			});
		})
		/**
		* @api {delete} /task/:id Excluir tarefa
		* @apiDescription Exclui a tarefa do id informado
		* @apiGroup Tarefas
		* @apiHeader {String} Authorization Token de usuário
		* @apiHeaderExample {json} Entrada
		*	{Authorization: 'JWT xyz.abc.123.hgf'}
		* @apiParam {String} id Id da tarefa
		* @apiSuccessExample {json} Sucesso
		*	HTTP/1.1 204 No Content
		* @apiErrorExample {json} Erro de consulta
		*	HTTP/1.1 400 Bad request
		* @apiVersion 1.0.0
		*/
		.delete((req, res) => {
			const user = req.user;
			Tasks.remove({ _id: req.params.id, 'user.id': user.id }, err => {
				if (err) {
					res.status(400).json(err);
					return;
				}
				res.sendStatus(204);
			});
		});
}
