const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const userApiRouter = require('./routes/user');
const postApiRouter = require('./routes/post');


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use('/user', userApiRouter);
app.use('/post', postApiRouter);

app.listen(5000, () => {
    console.log('server is running on 5000');
});