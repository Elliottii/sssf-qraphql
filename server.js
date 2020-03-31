'use strict';
require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema');
const port = 3000;
const app = express();
const cors = require('cors');
const db = require('./db/db');
const authRoute = require('./routes/authRoute');
const passport = require('./utils/pass');

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded


const checkAuth = (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (err || !user) {
            throw new Error('Not authenticated');
        }
    })(req, res)
};


app.use('/auth', authRoute);

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

