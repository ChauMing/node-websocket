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

    // 事件分发
    function emitEvent(eventName) {
        return function(args) {
            console.log(eventName);
            if(eventName !== 'message') {
                PubSub.emit(eventName, args);
                return;
            }
            PubSub.emit(eventName, args.data)

        }
    }
    // client类
    function Client(client) {
        this.client = client;
        this.client.onopen = emitEvent('open');
        this.client.onmessage = emitEvent('message');
        this.client.onclose = emitEvent('close');
        function get_client_id(data) {
            this._id = data.uuid;
            this.off('message', get_client_id);
        }
        this.on('message', get_client_id.bind(this))
    }

    Client.prototype = {
        contructor: Client,
        on: function(event, fn) {
            PubSub.on(event, fn);
        },
        off: function(event, fn) {
            PubSub.off(event, fn);
        },
        send: function(msg) {
            let that = this;
            let data = {
                _id: that._id
            }
            if(typeof msg === 'string') {
                data.type = 'string';
                data.message = msg;
            }
            if(typeof msg === 'object') {
                data.type = 'object';
                data.message = msg;
            }
            data.time = new Date();

            this.client.send(JSON.stringify(data));
        },
        close: function() {
            this.client.close();
        },
        
    }

    exports.ws = ws;


})(window, document);
