const User = require('./user')
const express = require('express')
const cors = require('cors')



const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = 4444

app.get('/', function (req, res) {
    console.log(req.body)
  })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

