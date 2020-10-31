const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const http = require('http')

app.use(express.static(__dirname + '/angular-app/dist/angular-app'));

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.get('/watchlist', (req, res) => {
  res.send('The prof said hed be nice about covid, but I still despise this assignment')
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname));
    // res.send(path.join(__dirname));

});

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})