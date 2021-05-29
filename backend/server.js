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

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postpassgresword1427',
        database: 'gestiune'
    }
})

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

app.post('/create-charts', async (req, res) => {
    try {
        const SECRET = process.env.SECRET_TOKEN;
        const { labels, datasetData, datasetLabel, color, title, headers } = req.body;
        const token = headers.Authorization;
        const decoded = jwt.verify(token, SECRET);
        let userId = decoded._id;
        await db.insert({
            labels: JSON.stringify(labels),
            chartdata: JSON.stringify(datasetData),
            color: JSON.stringify(color),
            datalabel: datasetLabel,
            userid: userId,
            title: title
        }).into('chart')
            .returning('*')
    } catch (err) {
        console.log(err);
    }
})

app.get('/user-charts', isAuthorized, async (req, res) => {
    try {
        const id = req.user._id;
        const chart = await db.select('id', 'labels', 'chartdata', 'datalabel', 'color', 'title').from('chart').where('userid', '=', id);
        res.json({
            chart
        }).status(200);
    } catch (err) {
        console.log(err);
    }
})

app.post('/delete-chart', async (req, res) => {
    try {
        const id = req.body.id;
        await db.delete().from('chart').where('id', '=', id);
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
})