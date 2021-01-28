const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

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
	origin: true,
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
	domain: '.ec2-3-36-122-114.ap-northeast-2.compute.amazonaws.com',
	path: '/',
    },
    name: '!__ cnc',
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userApiRouter);
app.use('/post', postApiRouter);

app.listen(5000, () => {
    console.log('server is running');
});
