const crypto = require('crypto');
const MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const decodeFrame = require('./frame').decodeFrame;
const encodeFrame = require('./frame').encodeFrame;

function socketOnDataHandler(data) {
    let frame = decodeFrame(data);
    console.log(frame.Payload_data.toString('utf-8'));
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
    

    socket.on('data', socketOnDataHandler);
    socket.write(RESPONSE_HEADERS);
}
function NW(http) {
    http.on('upgrade', httpOnUpgradeHandler);
}

module.exports = NW;