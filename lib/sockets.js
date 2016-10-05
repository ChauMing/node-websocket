'use strict';


const guid = require('./utils').guid;

const encodeFrame = require('./frame').encodeFrame;


function S(socket) {
    this.socket = socket;
}
S.prototype = {
    contructor: S,
    send: function(msg) {
        this.socket.write(encodeFrame({
            FIN: 1,
            Opcode: 1,
            PayloadData: msg
        }));
    }
}

let sockets = {
    length: 0,
};

sockets.add = function(socket) {
    let uuid = guid();
    sockets[uuid] = new S(socket);
    sockets.length += 1;
    return uuid;
}
sockets.remove = function(uuid) {
    sockets.length -= 1;
    delete sockets[uuid];
}
sockets.to = function(uuid) {
    return sockets[uuid];
}




module.exports = {
    sockets: sockets,
    S: S,
}