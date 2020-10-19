const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const pino = require('express-pino-logger')()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(pino)

app.get('/api/search', (req, res) => {
  console.log(req)
  const { selectedField, searchInput, token } = req.query
  axios
    .get(
      `http://52.56.157.110/api/v1/${selectedField}/dataleaks?${selectedField}=${searchInput}`,
      {
        headers: {
          Authorization: `JWT ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    .then(result => {
      // Successfully found data matching params
      res.send(result.data)
    })
    .catch(error => {
      // Unable to find 
      res.status(error.response.status).send(error)
    })
})

app.post('/api/login', (req, res) => {
  console.log(req.body)
  const { email, password } = req.body
  axios
    .post('http://52.56.157.110/api/auth/login/', {
      email,
      password
    })
    .then(result => {
      res.send(result.data)
    })
    .catch(error => {
      console.log(error)
      res.status(error.response.status).send(error)
    })
})

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
)
