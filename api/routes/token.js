import jwt from 'jwt-simple';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

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
    app.post("/token", (req, res) => {
        if (req.body.email && req.body.password) {
            const email = req.body.email;
            const password = req.body.password;
            Users.findOne({ email: email }, '_id password', (err, user) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                if (!user) {
                    res.status(401).json({
                        id: req.params._id,
                        error: "Usuário não encontrado"
                    });
                    return;
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.status(400).json(err);
                        return;
                    }
                    if (result) {
                        const payload = { id: user._id };
                        res.json({
                            token: jwt.encode(payload, cfg.jwtSecret)
                        });
                    } else {
                        res.status(401).json();
                    }
                })
            });
        } else {
            res.status(401).json();
        }
    });
}