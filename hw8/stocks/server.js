
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


app.get('/api/news-data/*', (req, res) => {
  var ticker = req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1);
  var news_path = "https://newsapi.org/v2/everything?apiKey=";
  request(news_path+api_key+'&q='+ticker, { json: true }, (err, result, body) => {
    if (err) { return console.log(err); }
    res.send(body);
  });
});

app.get('/api/chart-data/*', (req, res) => {

  var temp = req.originalUrl.substring(0, req.originalUrl.lastIndexOf('/'))
  var ticker = req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)
  var startDate = temp.substring(temp.lastIndexOf('/') + 1)
  // var tiingo_chart_path = 'https://api.tiingo.com/iex/'+ticker+'/prices?startDate='+startDate+'&resampleFreq=12hour&columns=open,high,low,close,volume&token=';
  var tiingo_chart_path = 'https://api.tiingo.com/iex/'+ticker+'/prices?startDate='+startDate+'&columns=open,high,low,close,volume&token=';

  request(tiingo_chart_path+token, { json: true }, (err, result, body) => {
    if (err) { return console.log(err); }
    var out = {'charts':body};
    res.send(out);
  });
})

app.get('/api/details/*', (req, res) => {
  var ticker = req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)
  const tiingo_summary_path = `https://api.tiingo.com/iex/`;
  const tiingo_daily_path = `https://api.tiingo.com/tiingo/daily/`;
  var requests_completed = 0;
  var request_num = 2;
  const out = {};
  let key;

  request(tiingo_summary_path + ticker + '?token='+token, { json: true }, (err, result, body) => {
    if (err) { return console.log(err); }
    for (key in body[0]) {
      if(body[0].hasOwnProperty(key)){
        out[key] = body[0][key];
      }
    }

    requests_completed++;
    if(requests_completed == request_num){
      res.send(out);
    }
  });

  request(tiingo_daily_path + ticker + '?token='+token, { json: true }, (err, result, body) => {
    if (err) { return console.log(err); }
    for (key in body) {
      if(body.hasOwnProperty(key)){
        out[key] = body[key];
      }
    }
    requests_completed++;
    if(requests_completed == request_num){
      res.send(out);
    }
  });
})

app.get('/api/tick-search/*', (req, res) => {
  var ticker = req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)

  const tiingo_search_path = `https://api.tiingo.com/tiingo/utilities/search/`;

  const results$ = RxHR.get(tiingo_search_path + ticker + '?token='+token, {json: true}).pipe(map(response => response.body));;

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