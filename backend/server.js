const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
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
const e = require('cors');

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

app.use('/uploads', express.static('uploads'));

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

    socket.emit('joined_user', userName);

    next();
})

io.on('connect', (socket) => {
    console.log("User connected", socket.id);

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has disconnected`);
    })
})

// Route for logging a user
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

// Route for registering a user
app.post('/register', async (req, res) => {
        try {
            const { email, lastName, firstName, username, password, gender, number} = req.body;

            await db.select('*').from('login').where('email', '=', email).then(user => {
                if(user[0]) {
                    res.json({
                        message: 'This email is already taken.'
                    })
                } else {
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        if(err) {
                            console.log(err);
                        }
                        db.insert({
                            firstname: firstName,
                            lastname: lastName,
                            email: email,
                            hash: hash,
                            username: username,
                            gender: gender,
                            number: number
                        }).into('login')
                            .returning('*')
                            .then(() => {
                                res.json({
                                    message: "Success"
                                })
                        })                        
                    });
                }
            })
        } catch (err) {
            console.log(err);
        }
})

// Route for getting user data for profile page
app.get('/profile', isAuthorized, async (req, res) => {
    try {       
        const id = req.user._id;
        let fileName = '';
        const user = await db.select('firstname', 'lastname', 'email', 'username', 'gender').from('login').where('id', '=', id);
        await db.select('*').from('avatar').where('userid', '=', id).then(res => {
            if(res[0]) {
                fileName = res[0].filename;
            } else {
                console.log("image not found", res[0]);
            }
        });
        const data =  user[0];
        const email = data.email;
        const firstName = data.firstname;
        const lastName = data.lastname;
        const username = data.username;
        const gender = data.gender;

        res.json({
            id,
            email,
            firstName,
            lastName,
            username,
            gender,
            fileName
        }).status(200);   
    } catch (err) {
        console.log(err);
    }
})

// Route for uploading a profile picture
app.post('/upload', upload.single('file'), isAuthorized, async (req, res) => {
    try {
        const userId = req.user._id;
        const { filename, mimetype, size, path } = req.file;
 
        await db.select('*').from("avatar").where("userid", '=', userId).then(res => {
            if (res[0]) {
                fs.readdir("./uploads", (err, files) => {
                    if (err) {
                        console.log('error reading avatar directory: ', err);
                    } else {
                        files.forEach(file => {
                            if (file === res[0].filename) {
                                fs.unlink(`./uploads/${res[0].filename}`, (err) => {
                                    if (err) {
                                      console.log('error deleting avatar file: ', res[0].filename);
                                    }
                                });
                            }
                        })
                    }
                });
            }
        });

        await db.delete().from('avatar').where('userid', '=', userId);

        db.insert({
            filename: filename,
            filepath: path,
            mimetype: mimetype,
            size: size,
            userid: userId
        }).into('avatar')
            .then(() => res.json({success: true, filename}))
            .catch(err => res.json ({success: false, message: 'upload failed', stack: err.stack}))

        await db('sharedcharts').where('userid', '=', userId).update({filename: filename});
    } catch (err) {
        console.log(err);
    }
})

// Route for getting a profile picture
app.get('/uploads/:userid/:filename', async (req, res) => {
    try {
        const { filename, userid } = req.params;
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
                .json({
                    success: false, 
                    message: 'not found', 
                    stack: err.stack,
                }),
            );
    } catch (err) {
        console.log(err);
    }
});

// Create a chart route
app.post('/create-charts', async (req, res) => {
    try {
        const SECRET = process.env.SECRET_TOKEN;
        const { labels, datasetData, datasetLabel, color, title, chartType, headers } = req.body;
        const token = headers.Authorization;
        const decoded = jwt.verify(token, SECRET);
        let userId = decoded._id;
        await db.insert({
            labels: JSON.stringify(labels),
            chartdata: JSON.stringify(datasetData),
            color: JSON.stringify(color),
            dataset: datasetLabel,
            userid: userId,
            title: title,
            charttype: chartType
        }).into('chart')
            .returning('*')
    } catch (err) {
        console.log(err);
    }
})

// Get user chart route
app.get('/user-charts', isAuthorized, async (req, res) => {
    try {
        const id = req.user._id;
        const chart = await db.select('id', 'labels', 'chartdata', 'dataset', 'charttype', 'color', 'title').from('chart').where('userid', '=', id);
        res.json({
            chart
        }).status(200);
    } catch (err) {
        console.log(err);
    }
})

// Delete chart route
app.post('/delete-chart', async (req, res) => {
    try {
        const id = req.body.id;
        await db.delete().from('chart').where('id', '=', id);
        await db.delete().from('sharedcharts').where('chartid', '=', id);
    } catch (err) {
        console.log(err);
    }
})

// Delete profile picture route
app.post('/delete-picture', async (req, res) => {
    try {
        const SECRET = process.env.SECRET_TOKEN;
        const { headers, avatar } = req.body;
        const token = headers.Authorization;
        const decoded = jwt.verify(token, SECRET);
        let userId = decoded._id;
        await db.delete().from('avatar').where('userid', '=', userId);
    } catch (err) {
        console.log(err);
    }
})

// Change username route
app.post('/change-username', async (req, res) => {
    try {
        const SECRET = process.env.SECRET_TOKEN
        const { headers, username } = req.body;
        const token = headers.Authorization;
        const decoded = jwt.verify(token, SECRET);
        let id = decoded._id;

        await db('login').where('id', '=', id).update({username: username}).then(() => {
            res.json({
                message: 'success'
            })
        });
    } catch (err) {
        console.log(err);
    }
})

// Change name route
app.post('/change-name', async (req, res) => {
    try {
        const SECRET = process.env.SECRET_TOKEN
        const { headers, firstname, lastname } = req.body;
        const token = headers.Authorization;
        const decoded = jwt.verify(token, SECRET);
        let id = decoded._id;

        await db('login').where('id', '=', id).update({firstname: firstname, lastname: lastname}).then(() => {
            res.json({
                message: 'success'
            })
        });
    } catch (err) {
        console.log(err);
    }
})

// Change email route
app.post('/change-email', async (req, res) => {
    try {
        const { headers, email } = req.body;
        const SECRET = process.env.SECRET_TOKEN
        const token = headers.Authorization;
        const decoded = jwt.verify(token, SECRET);
        let id = decoded._id;

        await db('login').where('id', '=', id).update({email: email}).then(() => {
            res.json({
                message: 'success'
            })
        });
    } catch (err) {
        console.log(err);
    }
})

// Share a chart route
app.post('/share-chart', async (req, res) => {
    try {
        const { id, shared } = req.body;

        await db('chart').where('id', '=', id).update({shared: shared}).then(() => {
            res.json({
                message: 'success'
            })
        });

        const data = await db.select('id', 'userid', 'labels', 'chartdata', 'dataset', 'charttype', 'color', 'title').from('chart').where('id', '=', id);
        const chart = data[0];
        let _userid =  chart.userid;
        const userData = await db.select('firstname', 'lastname').from('login').where('id', '=', _userid);
        const user = userData[0];

        let fileName = '';

        await db.select('*').from('avatar').where('userid', '=', _userid).then(res => {
            if(res[0]) {
                fileName = res[0].filename;
            } else {
                console.log("image not found", res[0]);
            }
        });

        let gender = '';

        await db.select('gender').from('login').where('id', '=', _userid).then(res => {
            if(res[0]) {
                gender = res[0].gender;
            } else {
                console.log('gender not found', res[0]);
            }
        })

        await db.insert({
            labels: JSON.stringify(chart.labels),
            chartdata: JSON.stringify(chart.chartdata),
            color: JSON.stringify(chart.color),
            dataset: chart.dataset,
            userid: chart.userid,
            title: chart.title,
            charttype: chart.charttype,
            firstname: user.firstname,
            lastname: user.lastname,
            chartid: chart.id,
            filename: fileName
        }).into('sharedcharts')
            .returning('*')
    } catch (err) {
        console.log(err);
    }
})

// Get a shared chart route
app.get('/shared-chart', async (req, res) => {
    try {
        const chart = await db.select('*').from('sharedcharts');
        res.json({
            chart
        }).status(200);
    } catch (err) {
        console.log(err);
    }
})

server.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
})