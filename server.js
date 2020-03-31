'use strict';
require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema');
const port = 3000;
const app = express();
const db = require('./db/db');

app.use('/graphql', graphqlHTTP(async () => ({
        schema: MyGraphQLSchema,
        graphiql: true,
    })),
);

db.on('connected', () => {
    app.listen(port);
});

