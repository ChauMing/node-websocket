let client = ws('ws://127.0.0.1:8888');
client.on('open', function (e) {
    client.send('open')
})
console.log(client);