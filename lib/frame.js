function decodeDataFrame(data) {
    let frame = {
        FIN: data[0] >> 7,
        Opcode: data[0] & 0b1111,
        Mask: data[1] >> 7,
        Payload_length: data[1] & 0b01111111
    };
    if(frame.Mask === 1) {
        frame.Masking_key = data.slice(2,6);
        frame.Payload_data = [];
        for(let i = 0; i < frame.Payload_length; i ++) {
            frame.Payload_data.push(data[6+i]^frame.Masking_key[i%4]);
        }
    } else {
        frame.Payload_data = data.slice(2, frame.Payload_length);
    }
    frame.Payload_data = new Buffer(frame.Payload_data);
    return frame;
}


function encodeDataFrame(e){
    let s = [],
        o = new Buffer(e.PayloadData),
        l=o.length;

    s.push((e.FIN<<7)+e.Opcode);

    if(l<126) s.push(l);
    else if(l<0x10000) s.push(126,(l&0xFF00)>>2,l&0xFF);
    else s.push(
        127, 0,0,0,0,
        (l&0xFF000000)>>6,(l&0xFF0000)>>4,(l&0xFF00)>>2,l&0xFF
    );

    return Buffer.concat([new Buffer(s),o]);
}


exports.encodeFrame = encodeDataFrame;
exports.decodeFrame = decodeDataFrame;