const WebSocket = require('ws');

const wsServer = new WebSocket.Server({port: 5555});

wsServer.on('connection', onConnect);

function onConnect(wsClient) {
    console.log('Новый пользователь');
    // отправка приветственного сообщения клиенту
    wsClient.send('Привет');
    wsClient.on('message', function(message) {
      console.log('message');
    })
    wsClient.on('close', function() {
      console.log('Пользователь отключился');
    })
}