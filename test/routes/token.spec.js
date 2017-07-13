describe('Routes: Token', () => {
    const User = mongoose.model('users');
    describe('POST /token', () => {
        beforeEach(done => {
            User.remove({}, () => {
                User.create({
                    name: 'Leandro Reolon',
                    email: 'leandroreolon@gmail.com',
                    password: '123456'
                }, (err) => done(err));
            });
        });
        describe('status 200', () => {
            it('returns authenticated token user', done => {
                request.post('/token')
                    .send({
                        email: 'leandroreolon@gmail.com',
                        password: '123456'
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.include.key('token');
                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('throws error when password is incorrect', done => {
                request.post('/token')
                    .send({
                        email: 'leandroreolon@gmail.com',
                        password: 'SENHA_ERRADA'
                    })
                    .expect(401)
                    .end(err => {
                        done(err);
                    });
            });
            it('throws error when email not exist', done => {
                request.post('/token')
                    .send({
                        email: 'EMAIL_ERRADO',
                        password: 'SENHA_ERRADA'
                    })
                    .expect(401)
                    .end(err => {
                        done(err);
                    });
            });
            it('throws error when email and password are blank', done => {
                request.post('/token')
                    .expect(401)
                    .end(err => {
                        done(err);
                    });
            });
        });
    });
});