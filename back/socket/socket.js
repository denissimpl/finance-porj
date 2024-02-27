const WebSocket = require('ws');
const Api = require('./../api')
const uri = "mongodb+srv://dice:dicedicedice@finance.ynrwdor.mongodb.net/?retryWrites=true&w=majority&appName=Finance";

const api = new Api(uri)
const wsServer = new WebSocket.Server({port: 5555});

wsServer.on('connection', onConnect);

async function handleAction(message) {
  switch (message.type){
    case "GET":
      return await api.getEntireData(message.login)
    case "UPDATE":
      return await api.handleData(message) 
  }
}

function onConnect(wsClient) {
  console.log('connect');
  wsClient.on('message', async function(message) {
    console.log(JSON.parse(message));
    result = await handleAction(JSON.parse(message))
    wsClient.send(JSON.stringify(result))
  })
}