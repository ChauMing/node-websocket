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
    length: 0
};

// 添加 socket 连接对象
sockets.add = function(socket) {
    let uuid = guid();
    sockets[uuid] = new S(socket);
    sockets.length += 1;
    return uuid;
}

// 删除某个 socket 连接
sockets.remove = function(uuid) {
    sockets.length -= 1;
    delete sockets[uuid];
}

// 根据 uuid 返回某个 socket 对象
sockets.to = function(uuid) {
    return sockets[uuid];
}

// 发广播
sockets.broadcast = function(msg) {
    for(let key in sockets) {
        let socket = sockets[key];
        if(socket instanceof S) {
            socket.send(msg);
        }
    }
}

module.exports = {
    sockets: sockets,
    S: S,
}
