(function(exports, document) {
    // 事件发布订阅
    var PubSub = (function() {  
        var queue = {};
        var subscribe = function(event, fn) {
            if (!queue[event]) queue[event] = [];
            queue[event].push(fn);
        }
        var publish = function(event, args) {
            var eventQueue = queue[event];
            if(!eventQueue) return;
            var len = eventQueue.length;
            if (eventQueue) {
                eventQueue.forEach(function(item, index) {
                    item(args);
                });
            }
        }
        var off = function(event, fn) {
            var eventQueue = queue[event];
            if (eventQueue) {
                queue[event] = eventQueue.filter(function(item) {
                    return item !== fn;
                });
            }
        }
        return {
            on: subscribe,
            emit: publish,
            off: off
        }
    }());


    // 连接器
    function ws(url) {
        return new Client(new WebSocket(url));
    }

    // 事件分布
    function emitEvent(eventName) {
        return function(args) {
            PubSub.emit(eventName, args);
        }
    }
    // client类
    function Client(client) {
        this.client = client;
        this.client.onopen = emitEvent('open');
        this.client.onmessage = emitEvent('message');
        this.client.onclose = emitEvent('close');
    }
    Client.prototype = {
        contructor: Client,
        on: function(event, fn) {
            PubSub.on(event, fn);
        },
        send: function(msg) {
            this.client.send(msg);
        },
        close: function() {
            this.client.close();
        }
    }



    exports.ws = ws;


})(window, document);