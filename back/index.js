const Api = require('./api')
const express = require('express')
const cors = require('cors')


const uri = "mongodb+srv://dice:dicedicedice@finance.ynrwdor.mongodb.net/?retryWrites=true&w=majority&appName=Finance";


const api = new Api(uri)
api.connectMongo()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = 4444

async function tryWrapper (callback, ...args) {
  try{
    await callback(args)
  } catch (e) {
    console.log(e);
    res.send(JSON.stringify({
      status: false,
      reason: "uncatched error"
    }))
    return
  }
} 



app.post('/register', async function (req, res) {
   tryWrapper(async () => {
    let user;
    await req.on("data", data => {
      user = JSON.parse(data.toString())
    })
    const {login, password} = user
    validation = Api.validateUser(login,password)
    if (!validation.status) {
      res.send(JSON.stringify({
        status: false,
        reason: validation.reason
      }))
      return
    } 
    const free = await api.checkLoginFreeness({login, password})
    if (!free) {
      res.send(JSON.stringify({
        status: false,
        reason: "Имя уже занято"
      }))
      return
    }
    const success = await api.createUser({
      login, 
      password, 
      income: {},
      expenses:  {},
    })
    if (!success) {
      res.send(JSON.stringify({
        status:success,
        reason: "creation error"
      }))
      return
    }
    res.send(JSON.stringify({
      status:success,
      login,
      password
    }))
   })
  })

app.post('/login', async function (req, res) {
  tryWrapper(async () => {
    let user;
    await req.on("data", data => {
      user = JSON.parse(data.toString())
    })
    const {login, password} = user
    const status = await api.getEntireData({login, password})
    if (!status) {
      res.send(JSON.stringify({
        status,
        reason: "Неверное имя пользователя или пароль"
      }))
      return
    }
    res.send(JSON.stringify({
      status: true,
      login,
      password
    }))
  })
  
})

app.post('/charts', async function (req, res) {
  tryWrapper(async () => {
    let user;
    await req.on("data", data => {
      user = JSON.parse(data.toString())
    })
    let {login, password} = user
    let result = await api.getEntireData({login, password})
    res.send(result)
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


process.on('exit',async function (){
  await api.closeMongo()  
});
