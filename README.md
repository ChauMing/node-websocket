# node-websocket

A simple websocket demo



##### server

```javascript
const nw = require('./lib/nw-core');
const http = require('http');

let server = http.createServer();

// 处理 upgrade 事件, 返回sockets 连接对象
let sockets = nw(server); 
sockets.to('uuid').send('msg'); // 向uuid 应的 socket 对象发送数据
sockets.broadcast('msg'); // 广播消息

```

##### client

```javascript
let client = ws('ws://127.0.0.1:8888'); // 连接

//注册连接成功以后的回调函数
client.on('open', function (e) { 
	client.send('msg') // 发送数据  
});

// 监听接收到消息的事件
client.on('message', function(msg) {
  console.log(msg)
});

```



