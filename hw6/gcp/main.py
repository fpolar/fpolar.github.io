# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
from flask import Flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin

import requests

from datetime import datetime
from dateutil.relativedelta import *


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#tiingo
token = '7575dba0525ff22472849e3fd5fe37cb7b70e825'

#newsapi
api_key = 'ba0e8e5efb0a41f78fd9c83f4054c355'

@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return '<b>STONKS</b>'

@app.route('/stonks', methods=['GET'])
def GETMESTONKS():
    if 'stnk' in request.args:
        stnk = str(request.args['stnk'])
    else:
        return "Error: No stock symbol (stnk) field provided."

    results = {}

    outlook_url =  'https://api.tiingo.com/tiingo/daily/'+stnk+ '?token='+token
    summary_url =  'https://api.tiingo.com/iex/'+stnk+ '?token='+token+''
    startDate = datetime.now()+relativedelta(months=-6)
    chart_url = 'https://api.tiingo.com/iex/'+stnk+'/prices?startDate='+startDate.strftime("%Y-%m-%d")+'&resampleFreq=12hour&columns=open,high,low,close,volume&token='+token
    news_url = 'https://newsapi.org/v2/everything?apiKey='+api_key+'&q='+stnk

    results['outlook'] = requests.get(outlook_url).text
    results['summary'] = requests.get(summary_url).text
    results['chart'] = requests.get(chart_url).text
    results['news'] = requests.get(news_url).text
    return results

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python38_app]
