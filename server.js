'use strict';
const express = require('express');
const graphqlHTTP = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema');
const port = 3000;
const app = express();
const db = require('./db/db');
app.use(
    '/graphql',
    graphqlHTTP({
        schema: MyGraphQLSchema,
        graphiql: true,
    }),
);

db.on('connected', () => {
    app.listen(port);
});

