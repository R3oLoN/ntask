import logger from './logger.js';

module.exports = {
    database: 'mongodb://localhost/ntask',
    username: '',
    password: '',
    logging: (coll, method, query, fields) => {
        logger.info(`collection: ${coll}, method: ${method}, query: ${JSON.stringify(query)}, fields: ${JSON.stringify(fields)}`);
    },
    jwtSecret: 'Nt@$K-AP1',
    jwtSession: { session: false }
}