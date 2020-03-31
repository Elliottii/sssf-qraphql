'use strict';
require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema');
const port = 3000;
const app = express();
const db = require('./db/db');

// dummy function to set user (irl: e.g. passport-local)
const auth = (req, res, next) => {
    req.user = true;
    next();
};

// dummy function to check authentication (irl: e.g. passport-jwt)
const checkAuth = (req, res) => {
    console.log('user', req.user);
    if (!req.user)
        throw new Error('Not authenticated');
};

app.use(auth);


app.use('/graphql', (req, res) => {
        graphqlHTTP(async () => ({
            schema: MyGraphQLSchema,
            graphiql: true,
            context: {req, res, checkAuth},
        }))(req, res)
    },
);

db.on('connected', () => {
    app.listen(port);
});

