import mongoose from 'mongoose';

module.exports = app => {
    const Users = mongoose.model('users');

    app.route('/users')
        .all(app.libs.auth.authenticate())
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
        .post((req, res) => {
            Users.create(req.body, (err, user) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json(user);
            });
        });

    app.route('/user')
        .all(app.libs.auth.authenticate())
        .get((req, res) => {
            const user = req.user;
            Users.findOne({_id: user.id}, (err, user) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json(user);
            });
        })
        .put((req, res) => {
            const user = req.user;
            Users.findOne({_id: user.id}, (err, user) => {
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
                        res.json(updated);
                    })
                    .catch(err => {
                        res.status(400).json(err);
                    });
            });
        })
        .delete((req, res) => {
            const user = req.user;
            Users.remove({_id: user.id}, err => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.sendStatus(204);
            });
        });
}
