/**
 * Created by Malcom on 10/25/2016.
 */
var io = require('socket.io')();

io.on('connection', function (socket) {
    console.log("socket connected!");
});
module.exports = io;