const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
// const multer = require('multer');
const path = require('path');

const passportConfig = require('./passport');
const userApiRouter = require('./routes/user');
const postApiRouter = require('./routes/post');

const app = express();

dotenv.config();
passportConfig();
app.use(morgan('dev'));
app.use(express.json());
app.use('/', express.static('upload'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: '!__ cnc',
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(multer({ dest: path.join(__dirname, 'img/') }));

app.use('/user', userApiRouter);
app.use('/post', postApiRouter);

app.listen(5000, () => {
    console.log('server is running on 5000');
});