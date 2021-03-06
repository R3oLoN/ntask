import jwt from 'jwt-simple';

describe('Routes: Tasks', () => {
    const User = mongoose.model('users');
    const Tasks = mongoose.model('tasks');
    const jwtSecret = app.libs.config.jwtSecret;
    const AUTHORIZATION = 'Authorization'
    let tasks = [];
    let fakeTask;
    let token;
    let user;
    beforeEach(done => {
        tasks = [];
        fakeTask = null;
        token = null;
        user = null;
        User.remove({}, () => {
            User.create({
                name: 'Leandro Reolon',
                email: 'leandroreolon@gmail.com',
                password: '123456'
            }, (err, newUser) => {
                if (err) {
                    done(err);
                    return;
                }
                user = newUser;
                Tasks.remove({}, () => {
                    Tasks.create({
                        title: "Work",
                        user: {
                            id: newUser._id,
                            name: newUser.name
                        }
                    }, (err, task) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        tasks.push(task);
                        fakeTask = Utils.copy(tasks[0]);
                        token = jwt.encode({
                            id: newUser._id
                        }, jwtSecret);
                        Tasks.create({
                            title: "Study",
                            user: {
                                id: newUser._id,
                                name: newUser.name
                            }
                        }, (err, task) => {
                            if (err) {
                                done(err);
                                return;
                            }
                            tasks.push(task);
                            done();
                        });
                    });
                });
            });
        });
    });
    describe('GET /tasks', () => {
        describe('status 200', () => {
            it('returns a list of tasks', done => {
                request.get('/tasks')
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.length(2);
                        expect(res.body[0].title).to.eql('Work');
                        expect(res.body[1].title).to.eql('Study');
                        done(err);
                    });
            });
        });
    });
    describe('POST /tasks', () => {
        describe('status 200', () => {
            it('create a new task', done => {
                request.post('/tasks')
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .send({
                        title: 'Run'
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.title).to.eql('Run');
                        expect(res.body.user.name).to.eql(user.name);
                        expect(res.body.done).to.be.false;
                        done(err);
                    });
            });
        });
    });
    describe('GET /task/:id', () => {
        describe('status 200', () => {
            it('returns one task', done => {
                request.get(`/task/${fakeTask._id}`)
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body._id).to.eql(fakeTask._id);
                        expect(res.body.title).to.eql(fakeTask.title);
                        expect(res.body.user.id).to.eql(fakeTask.user.id);
                        expect(res.body.user.name).to.eql(fakeTask.user.name);
                        expect(res.body.done).to.be.false;
                        done(err);
                    });
            });
        });
        describe('status 404', () => {
            beforeEach(done => {
                Tasks.remove({ _id: fakeTask._id }, () => {
                    done();
                });
            });
            it('throws error when task not exists', done => {
                request.get(`/task/${fakeTask._id}`)
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body.id).to.eql(fakeTask._id);
                        expect(res.body.error).to.eql('Registro não encontrado');
                        done(err);
                    });
            });
        });
    });
    describe('PUT /task/:id', () => {
        describe('status 200', () => {
            it('update a task', done => {
                request.put(`/task/${fakeTask._id}`)
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .send({
                        title: "Travel",
                        done: true
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.title).to.eql("Travel");
                        expect(res.body.done).to.be.true;
                        done(err);
                    });
            });
        });
    });
    describe('DELETE /task/:id', () => {
        describe('status 204', () => {
            it('remove a task', done => {
                request.delete(`/task/${fakeTask._id}`)
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });
});