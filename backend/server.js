const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

const db = knex({ 
    client: 'pg',
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "postgres123",
        database: "gestiune"
    }
})

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send(db.users) })
app.post('/login', (req, res) => { login.handleLogin(db, bcrypt) })

app.listen(5000);