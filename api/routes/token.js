import jwt from 'jwt-simple';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import { GQC, TypeComposer } from 'graphql-compose';
const { promisify } = require('util');

module.exports = app => {
  const cfg = app.libs.config;
  const Users = mongoose.model('users');
  /**
   * @api {post} /token Token de autenticado
   * @apiGroup Credenciais
   * @apiParam {String} email Email de usuário
   * @apiParam {String} password Senha de usuário
   * @apiParamExample {json} Estrada
   *  {
   *      email: 'leandroreolon@gmail.com',
   *      password: '123456'
   *  }
   * @apiSuccess {String} token Token de usuário autenticado
   * @apiSuccessExample {json} Sucesso
   *  HTTP/1.1 200 Ok
   *  {token: 'xyz.abc.123.hgf'}
   * @apiErrorExample {json} Erro de autenticação
   *  HTTP/1.1 401 Unauthorized
   * @apiVersion 1.0.0
   */
  app.post('/token', async (req, res) => {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      const { code, message, token } = await checkCredentials(email, password);
      res.status(code).json(token);
    } else {
      res.status(401).json(message)
    }
  });

  async function checkCredentials(email, password) {
    try {
      const user = await Users.findOne({ email: email }, '_id password');
      if (!user) {
        return {
          code: 401,
          message: {
            error: 'Usuário não encontrado'
          }
        };
      }
      const result = await promisify(bcrypt.compare)(password, user.password);
      if (result) {
        console.log(result);
        const payload = { id: user._id };
        return {
          code: 200,
          token: jwt.encode(payload, cfg.jwtSecret)
        };
      }
      return {
        code: 401,
        message: {
          error: 'Usuário ou senha inválido!'
        }
      };
    } catch (err) {
      return {
        code: 400,
        message: err
      };
    }
  }
};
