const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const isAuthorized = require('./middlewares/authorization');
require('dotenv').config();
const saltRounds = 10;
const port = 5500;
const http = require('http');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().valueOf() + file.originalname)
    }
})

const upload = multer({ storage });

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const {
    AVATAR_MALE_PLACEHOLDER,
    AVATAR_FEMALE_PLACEHOLDER,
} = require('./user/constants');

app.use(express.static('public'));
app.use('/avatar_placeholder', express.static('avatar_placeholder'));

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

io.use( async (socket, next) => {
    const token = socket.handshake.auth.token;
    let decoded = jwt.decode(token);
    const id = decoded._id;
    const data = await db.select('username').from('login').where('id', '=', id);
    const user = data[0];
    const userName = user.username;

    console.log(userName);

    socket.emit('joined_user', userName);

    next();
})

io.on('connect', (socket) => {
    console.log("User connected", socket.id);

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has disconnected`);
    })
})

app.post('/login', async (req, res) => {
    try {
        const data = await db.select('email', 'hash', 'id').from('login')
        .where('email', '=', req.body.email);  
        const foundUser = data[0]; 
        if(foundUser === undefined) {
            res.json({
                message: "User not found, please register."
            })
        }
        const passwordMatches =  await bcrypt.compare(req.body.password, foundUser.hash);
        if (passwordMatches) {
            const token = jwt.sign({ _id: data[0].id }, process.env.SECRET_TOKEN, {
                expiresIn: "28d",
              });
              res.json({
                  token,
                  message: "Success"
              });
        } else {
            return res.json({
                message: "Wrong password"
            });
        }
    } catch (err) {
        console.log(err);
    }
})

app.post('/register', async (req, res) => {
        try {
            const { email, lastName, firstName, username, password, gender } = req.body;
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if(err) {
                        console.log(err + err);
                    }
                    db.insert({
                        firstname: firstName,
                        lastname: lastName,
                        email: email,
                        hash: hash,
                        username: username,
                        gender: gender
                    }).into('login')
                        .returning('*')
                        .then(user => {
                            console.log(user[0])
                            res.json({
                                message: "Success"
                            })
                    })
                });
        } catch (err) {
            console.log(err);
        }
})

app.get('/profile', isAuthorized, async (req, res) => {
    try {       
        const id = req.user._id;
        const user = await db.select('firstname', 'lastname', 'email', 'username', 'gender').from('login').where('id', '=', id);
        const avatar = await db.select('*').from('avatar').where('userid', '=', id);
        const avData = avatar[0];
        const data =  user[0];
        const email = data.email;
        const firstName = data.firstname;
        const lastName = data.lastname;
        const username = data.username;
        const gender = data.gender;
        filename = avData.filename;
        res.json({
            id,
            email,
            firstName,
            lastName,
            username,
            gender,
            filename
        }).status(200);    
    } catch (err) {
        console.log(err);
    }
})

app.post('/upload', upload.single('file'), isAuthorized, async (req, res) => {
    try {
        const userId = req.user._id;
        const { filename, mimetype, size, path } = req.file;
        console.log(userId)
        console.log(req.file);

        db.insert({
            filename: filename,
            filepath: path,
            mimetype: mimetype,
            size: size,
            userid: userId
        }).into('avatar')
            .then(() => res.json({success: true, filename}))
            .catch(err => res.json ({success: false, message: 'upload failed', stack: err.stack}))
    } catch (err) {
        console.log(err);
    }
})

app.get('/image/:userid/:filename', async (req, res) => {
    try {
        const { filename, userid} = req.params;
        console.log(userid);
        // const data = await db.select('gender').from('login').where('id', '=', userid);
        // const gender = data[0];
        // console.log(gender, userid);
        await db
            .select('*')
            .from('avatar')
            .where({ filename, userid })
            .then(images => {
                if (images[0]) {
                    const dirname = path.resolve();
                    const fullfilepath = path.join(dirname, images[0].filepath);
                    return res.type(images[0].mimetype).sendFile(fullfilepath);
                }
            })
            .catch(err => res
                .status(404)
                .json(
                    {
                        success: false, 
                        message: 'not found', 
                        stack: err.stack,
                    }
                ),
            );
    } catch (err) {
        console.log(err);
    }
});


app.post('/create-charts', async (req, res) => {
    try {
        const SECRET = process.env.SECRET_TOKEN;
        const { labels, datasetData, datasetLabel, color, title, headers } = req.body;
        const token = headers.Authorization;
        const decoded = jwt.verify(token, SECRET);
        console.log('success');
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

server.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
})