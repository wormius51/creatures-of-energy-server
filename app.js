const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || '5000';
const app = express();
app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
var randomString = "";
for (let i = 0; i < 5; i++) {
    randomString += Math.random().toString(36).substring(2, 15);
}
app.use(session({secret : randomString, resave : false, saveUninitialized : true}));

app.use('/session',require('./session'));
app.use('/match-making',require('./match-making'));


/*const server = require('http').Server(app);
const io = require('socket.io')(server);
io.on('connection',client => {
    console.log('client connection: ' + client);
    client.on('match-start', data => {
        console.log(data);
    })
    client.on('make-move', data => {
        console.log(data);
    });

    client.emit('make-move',client.id);
});
*/
//module.exports.io = io;