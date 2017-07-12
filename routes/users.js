import mongoose from 'mongoose';

module.exports = app => {
    const Users = mongoose.model('users');

    app.route('/users')
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

    app.route('/users/:_id')
        .get((req, res) => {
            Users.findOne(req.params, (err, user) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json(user);
            });
        })
        .put((req, res) => {
            Users.findOne(req.params, (err, user) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                if (!user) {
                    res.status(400).json({
                        id: req.params._id,
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
            Users.remove(req.params, err => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.sendStatus(204);
            });
        });
}
