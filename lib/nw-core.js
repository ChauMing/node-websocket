const crypto = require('crypto');
const MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const {decodeFrame, encodeFrame} = require('./frame');

const sockets = require('./sockets').sockets;


function socketOnDataHandler(socket) {
    return function(data) {
        let frame = decodeFrame(data);
        if(frame.Opcode === 1) {
            console.log(frame.Payload_data.toString('utf8'));
        }
        if(frame.Opcode === 8) {
            socket.end();
            socket.destroy();
            sockets.remove(frame.Payload_data._id);
        }
    }
}

function httpOnUpgradeHandler(req, socket) {
    const SEC_WEBSOCKET_KEY = req.headers['sec-websocket-key'];
    const SEC_WEBSOCKET_ACCEPT = crypto.createHash('sha1')
                                       .update(SEC_WEBSOCKET_KEY)
                                       .update(MAGIC_STRING)
                                       .digest('base64');

    const RESPONSE_HEADERS = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-Websocket-Accept: ${SEC_WEBSOCKET_ACCEPT}`,
        '\r\n'
    ].join('\r\n');

    socket.on('data', socketOnDataHandler(socket));
    socket.write(RESPONSE_HEADERS);

    let id = sockets.add(socket);

    socket.write(encodeFrame({
        FIN: 1,
        Opcode: 1,
        PayloadData: JSON.stringify({
            uuid: id,
        })
    }));
}

function NW(http) {
    http.on('upgrade', httpOnUpgradeHandler);
    return sockets;
}

module.exports = NW;
