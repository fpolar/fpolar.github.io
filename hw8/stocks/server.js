
const RxHR = require('@akanass/rx-http-request').RxHR
const map = require('rxjs/operators').map

const request = require('request');
var cors = require('cors')

const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const http = require('http')


// tiingo
var token = '7575dba0525ff22472849e3fd5fe37cb7b70e825'

// newsapi
var api_key = 'ba0e8e5efb0a41f78fd9c83f4054c355'

app.use(cors())
app.use(express.static(__dirname + '/angular-app/dist/angular-app'));

app.get('/watchlist', (req, res) => {
  res.send('The prof said hed be nice about covid, but I still despise this assignment')
})

app.get('/details/*', (req, res) => {
  var ticker = req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)
  res.send('The prof said hed be nice about covid, but I still despise this assignment')
})

app.get('/api/tick-search/*', (req, res) => {
  var ticker = req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)

  const tiingo_search_path = `https://api.tiingo.com/tiingo/utilities/search/`;

  const results$ = RxHR.get(tiingo_search_path + ticker + '?token='+token, {json: true}).pipe(map(response => response.body));;

  request(tiingo_search_path + ticker + '?token='+token, { json: true }, (err, result, body) => {
    if (err) { return console.log(err); }
    // console.log(body.url);
    // console.log(body.explanation);
    //res.json(result);
  });

  results$.subscribe(console.log);
  results$.subscribe(
		result => {
        res.json(result);
  	});
  
  // results = {}

  // outlook_url =  'https://api.tiingo.com/tiingo/daily/'+stnk+ '?token='+token
  // summary_url =  'https://api.tiingo.com/iex/'+stnk+ '?token='+token+''
  // startDate = datetime.now()+relativedelta(months=-6)
  // chart_url = 'https://api.tiingo.com/iex/'+stnk+'/prices?startDate='+startDate.strftime("%Y-%m-%d")+'&resampleFreq=12hour&columns=open,high,low,close,volume&token='+token
  // news_url = 'https://newsapi.org/v2/everything?apiKey='+api_key+'&q='+stnk

  // results['outlook'] = requests.get(outlook_url).text
  // results['summary'] = requests.get(summary_url).text
  // results['chart'] = requests.get(chart_url).text
  // results['news'] = requests.get(news_url).text
  // return results

  // res.send(results$)
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname));

});

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})