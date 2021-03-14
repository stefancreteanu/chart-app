const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const isAuthorized = require('./middlewares/authorization')
require('dotenv').config();
const saltRounds = 10;
const port = 5500;

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postpassgresword1427',
        database: 'gestiune'
    }
})

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.post('/login', async (req, res) => {
    try {
        const data = await db.select('email', 'hash', 'id').from('login')
        .where('email', '=', req.body.email);    
        const foundUser = data[0];  
        const passwordMatches =  await bcrypt.compare(req.body.password, foundUser.hash);
        
        if (passwordMatches) {
            const token = jwt.sign({ _id: data[0].id }, process.env.SECRET_TOKEN, {
                expiresIn: "28d",
              });
              res.json({
                  token,
              }).status(200);
        } else {
            res.sendStatus(403);
        }
    } catch (err) {
        console.log('err: ', err);
    }
})

app.post('/register', async (req, res) => {
        try {
            const { email, lastName, firstName, phone, password, gender } = req.body;
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err) {
                    console.log(err);
                }
                db.insert({
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    hash: hash,
                    phone: phone,
                    gender: gender
                }).into('login')
                    .returning('*')
                    .then(user => {
                        res.json(user[0])
                        console.log(user);
                })
            });
        } catch (err) {
            console.log(err);
        }
})

app.get('/profile', isAuthorized, async (req, res) => {
    try {       
        const id = req.user._id;
        const user = await db.select('firstname', 'lastname', 'email', 'phone', 'gender').from('login').where('id', '=', id)
        const data =  user[0];
        const email = data.email;
        const firstName = data.firstname;
        const lastName = data.lastname;
        const phone = data.phone;
        const gender = data.gender;
        res.json({
            id,
            email,
            firstName,
            lastName,
            phone,
            gender
        }).status(200);
    } catch (err) {
        console.log(err);
    }
})

app.post('/create-table', async (req, res) => {
    try {
        // const id = req.user._id
        const id = 1;
        const { chartName, labels, dataLabel, data } = req.body
        console.log(chartName, labels, data, dataLabel);
        db.insert({
            id: id,
            chartname: chartName,
            labels: labels,
            chartdata: data,
            datalabel: dataLabel
        }).into('chart')
            .returning('*')
            .then(chart => {
                res.json(chart[0])
                console.log(chart);
            })
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
})