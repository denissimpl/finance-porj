const Api = require('./api')
const express = require('express')
const cors = require('cors')


const uri = "mongodb+srv://dice:dicedicedice@finance.ynrwdor.mongodb.net/?retryWrites=true&w=majority&appName=Finance";


const api = new Api(uri)
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = 4444



app.post('/register', async function (req, res) {
  try {
    let user;
    await req.on("data", data => {
      user = JSON.parse(data.toString())
    })
    const {login, password} = user
    console.log(login, password);
    validation = Api.validateUser(login,password)
    if (!validation.status) {
      res.send(JSON.stringify({
        status: false,
        reason: validation.reason
      }))
      console.log('1');
      return
    } 
    const free = await api.checkLoginFreeness({login, password})
    if (!free) {
      res.send(JSON.stringify({
        status: false,
        reason: "Имя уже занято"
      }))
      console.log('2');
      return
    }
    const success = await api.createUser({
      login, 
      password, 
      income: {
        total: 0,
      },
      expenses: {
        total: 0,
      }
    })
    if (!success) {
      res.send(JSON.stringify({
        status:success,
        reason: "creation error"
      }))
      console.log('3');
      return
    }
    res.send(JSON.stringify({
      status:success,
      login,
      password
    }))
  } catch (e) {
    console.log(e);
    res.send(JSON.stringify({
      status: false,
      reason: "uncatched error"
    }))
    return
  }
   
  })

app.post('/login', async function (req, res) {
  try {
    let user;
    await req.on("data", data => {
      user = JSON.parse(data.toString())
    })
    const {login, password} = user
    console.log(login, password);
    const status = await api.getUser({login, password})
    if (!status) {
      res.send(JSON.stringify({
        status,
        reason: "Неверное имя пользователя или пароль"
      }))
      return
    }
    res.send(JSON.stringify({
      status,
      login,
      password
    }))
  } catch (e) {
    console.log(e);
    res.send(JSON.stringify({
      status: false,
      reason: "uncatched error"
    }))
    return
  }
  
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


