import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';

module.exports = app => {
    const Users = mongoose.model('users');
    const cfg = app.libs.config;
    const params = {
        secretOrKey: cfg.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    }
    passport.use(new Strategy(params, (payload, done) => {
        console.log(payload);
        Users.findOne({ _id: payload.id }, (err, user) => {
            if (err) {
                done(err, null);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, {
                id: user._id,
                email: user.email
            });
        });
    }));
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticate: () => {
            return passport.authenticate('jwt', cfg.jwtSession);
        }
    };
}