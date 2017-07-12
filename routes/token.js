import jwt from 'jwt-simple';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

module.exports = app => {
    const cfg = app.libs.config;
    const Users = mongoose.model('users');
    app.post("/token", (req, res) => {
        if (req.body.email && req.body.password) {
            const email = req.body.email;
            const password = req.body.password;
            Users.findOne({ email: email }, (err, user) => {
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