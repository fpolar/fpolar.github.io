
function setHighChartsData(title, data1, data2){
            Highcharts.stockChart('chart_container', {
		        title: {
		            text: title
		        },

		        subtitle: {
		            text: 'Source: <a href="https://api.tiingo.com/">Tiingo</a>'
		        },

		        xAxis: {
		        	title: '', 
		            gapGridLineWidth: 0,
				    type: 'datetime'
		        },
		        yAxis: [{ 
				    labels: {
				        format: '{value}',
				        style: {
				            color: '#000000'
				        }
				    },
				    title: {
				        text: 'Stock Price',
				        style: {
				            color: '#000000'
				        }
				    }
				},
				    {
			        labels: {
			            formatter: function() {
				          return this.value / 1000 + 'k';
				        },
				        style: {
			                color: '#000000'
			            }
			        },
			        title: {
			            text: 'Volume',
			            style: {
			                color: '#000000'
			            }
			        },
				    opposite: true
			    }],

		        rangeSelector: {
            		allButtonsEnabled: true,
		            buttons: [ {
		                type: 'day',
		                count: 7,
		                text: '7d'
		            }, {
		                type: 'day',
		                count: 15,
		                text: '15d'
		            }, {
		                type: 'month',
		                count: 1,
		                text: '1m'
		            }, {
		                type: 'month',
		                count: 3,
		                text: '3m'
		            }, {
		                type: 'month',
		                count: 6,
		                text: '6m'
		            }],
		            selected: 4
		        },

		        series: [{
		            name: 'AAPL',
		            type: 'area',
		            data: data1,
		            yAxis: 0,
		            gapSize: 5,
		            tooltip: {
		                valueDecimals: 2
		            },
		            fillColor: {
		                linearGradient: {
		                    x1: 0,
		                    y1: 0,
		                    x2: 0,
		                    y2: 1
		                },
		                stops: [
		                    [0, Highcharts.getOptions().colors[0]],
		                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
		                ]
		            },
		            threshold: null
		        },
		        {
		            name: 'BAPL',
		            type: 'column',
		            yAxis: 1,
		            data: data2,
		            gapSize: 5,
		            tooltip: {
		                valueDecimals: 2
		            },
		            fillColor: {
		                linearGradient: {
		                    x1: 0,
		                    y1: 0,
		                    x2: 0,
		                    y2: 1
		                },
		                stops: [
		                    [0, Highcharts.getOptions().colors[0]],
		                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
		                ]
		            },
		            threshold: null
		        }]
            });
        //}
    //);
}