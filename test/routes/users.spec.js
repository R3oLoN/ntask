import jwt from 'jwt-simple';

describe('Routes: Users', () => {
    const User = mongoose.model('users');
    const jwtSecret = app.libs.config.jwtSecret;
    const AUTHORIZATION = 'Authorization'
    let token;
    let user;
    beforeEach(done => {
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
                user = Utils.copy(newUser);
                token = jwt.encode({
                    id: newUser._id
                }, jwtSecret);
                User.create({
                    name: 'Manuella Collodel',
                    email: 'manuella.collodel@gmail.com',
                    password: '123456'
                }, (err, newUser) => {
                    if (err) {
                        done(err);
                        return;
                    }
                    done();
                });
            });
        });
    });
    describe('GET /users', () => {
        describe('status 200', () => {
            it('returns a list of users', done => {
                request.get('/users')
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.length(2);
                        expect(res.body[0].name).to.eql('Leandro Reolon');
                        expect(res.body[1].name).to.eql('Manuella Collodel');
                        expect(res.body[0].email).to.eql('leandroreolon@gmail.com');
                        expect(res.body[1].email).to.eql('manuella.collodel@gmail.com');
                        done(err);
                    });
            });
        });
    });
    describe('POST /users', () => {
        describe('status 200', () => {
            it('create a new user', done => {
                request.post('/users')
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .send({
                        name: 'Fulano de Tal',
                        email: 'fulano@gmail.com',
                        password: '123456'
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.name).to.eql('Fulano de Tal');
                        expect(res.body.email).to.eql('fulano@gmail.com');
                        done(err);
                    });
            });
        });
    });
    describe('GET /user/:id', () => {
        describe('status 200', () => {
            it('returns one user', done => {
                request.get('/user')
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body._id).to.eql(user._id);
                        expect(res.body.name).to.eql(user.name);
                        expect(res.body.email).to.eql(user.email);
                        done(err);
                    });
            });
        });
    });
    describe('PUT /user/:id', () => {
        describe('status 200', () => {
            it('update a user', done => {
                request.put('/user')
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .send({
                        name: "Travel"
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.name).to.eql("Travel");
                        done(err);
                    });
            });
        });
    });
    describe('DELETE /user/:id', () => {
        describe('status 204', () => {
            it('remove a user', done => {
                request.delete('/user')
                    .set(AUTHORIZATION, `JWT ${token}`)
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });
});