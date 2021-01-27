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

app.post('/register', (req, res) => {
        const { email, name, password } = req.body;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err) {
                console.log(err);
            }

            db.insert({
                name: name,
                email: email,
                hash: hash,
                joined: new Date()
            }).into('login')
                .returning('*')
                .then(user => {
                    res.json(user[0])
                    console.log(user);
            })
        });
})

app.get('/profile/', isAuthorized, async (req, res) => {
    try {       
        const id = req.user._id;
        const user = await db.select('name', 'email', 'joined').from('login').where('id', '=', id)
        const data =  user[0];
        const email = data.email;
        const username = data.name;
        const joined = data.joined;
        res.json({
            id,
            email,
            username,
            joined
        }).status(200);
    } catch (err) {
        console.log(err);
    }
})



app.listen(5500, () => {
    console.log('SERVER IS RUNNING ON PORT 5500');
})