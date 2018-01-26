import graphqlHTTP from 'express-graphql';
import { GQC } from 'graphql-compose';

module.exports = app => {
  app
    .route('/graphql')
    .all(app.libs.auth.authenticate())
    .all(
      graphqlHTTP({
        schema: GQC.buildSchema(),
        graphiql: true
      })
    );
};
