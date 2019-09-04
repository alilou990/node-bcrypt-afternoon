require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const cors = require('cors')

//controller files
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')

//middleware files
const auth = require('./middleware/authMiddleware')

const app = express();

const {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET
} = process.env

app.use(express.json());
app.use(cors());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 60000
    }
}))

massive(CONNECTION_STRING)
    .then(dbInstance => {
        app.set('db', dbInstance)
        console.log('Database Connected!')
    })
    .catch(error => {
        console.log(error)
    })

//end points

//authController
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

//treasure controller
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(SERVER_PORT, () => {
    console.log('Server Running! 👾')
})

