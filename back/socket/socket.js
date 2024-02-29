const WebSocket = require('ws');
const Api = require('./../api')
const uri = "mongodb+srv://dice:dicedicedice@finance.ynrwdor.mongodb.net/?retryWrites=true&w=majority&appName=Finance";

const api = new Api(uri)
api.connectMongo()
const wsServer = new WebSocket.Server({port: 5555});


wsServer.on('connection', onConnect);

async function handleAction(message) {
  switch (message.type){
    case "GET":
      return await api.getEntireData(message)
    case "PUT":
      return await api.handleData(message)
    case "DELETE":
      return await api.handleData(message)
  }
}



async function onConnect(wsClient) {
  function updateData () {
    setTimeout(() => {
      wsClient.send(JSON.stringify(api.getData()))
      updateData()
    }, 1500);
  }
  wsClient.on('message', async function(message) {
    result = await handleAction(JSON.parse(message))
    wsClient.send(JSON.stringify(result))
  })
  updateData()
}

process.on('exit',async function (){
  await api.closeMongo()  
});