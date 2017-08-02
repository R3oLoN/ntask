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
        Users.findOne({ _id: payload.id }, (err, user) => {
            if (err) {
                return done(err, null);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, {
                id: user._id,
                email: user.email,
                name: user.name
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