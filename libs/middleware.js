import bodyParser from 'body-parser';

module.exports = app => {
    app.set('port', 3000);
    app.set('json spaces', 4);
    app.use(bodyParser.json());
    app.use(app.libs.auth.initialize());
}