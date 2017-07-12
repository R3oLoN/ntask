import mongoose from 'mongoose';

module.exports = app => {
    const Tasks = mongoose.model('tasks');

    app.route('/tasks')
        .all(app.libs.auth.authenticate())
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

    app.route('/tasks/:id')
        .all(app.libs.auth.authenticate())
        .get((req, res) => {
            const user = req.user;
            Tasks.findOne({ _id: req.params.id, 'user.id': user.id }, (err, task) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json(task);
            });
        })
        .put((req, res) => {
            Tasks.findOne({ _id: req.params.id, 'user.id': user.id }, (err, task) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                if (!task) {
                    res.status(400).json({
                        id: req.params._id,
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
        .delete((req, res) => {
            Tasks.remove({ _id: req.params.id, 'user.id': user.id }, err => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.sendStatus(204);
            });
        });
}
