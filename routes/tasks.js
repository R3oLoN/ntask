import mongoose from 'mongoose';

module.exports = app => {
    const Tasks = mongoose.model('tasks');

    app.route('/tasks')
        .all(app.libs.auth.authenticate())
        .get((req, res) => {
            Tasks.find({})
                .exec((err, tasks) => {
                    if (err) {
                        res.status(400).json(err);
                        return;
                    }
                    res.json(tasks);
                });
        })
        .post((req, res) => {
            Tasks.create(req.body, (err, task) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json(task);
            });
        });

    app.route('/tasks/:_id')
        .all(app.libs.auth.authenticate())
        .get((req, res) => {
            Tasks.findOne(req.params, (err, task) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json(task);
            });
        })
        .put((req, res) => {
            Tasks.findOne(req.params, (err, task) => {
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
            Tasks.remove(req.params, err => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.sendStatus(204);
            });
        });
}
