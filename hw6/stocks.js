var api_url = 'https://csci-gcp-stocks.wn.r.appspot.com/stonks';
//api_url = 'http://localhost:8080/stonks'

var data_ready = false;

var form = document.getElementById("splash");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

function displaySection(section_name){
	if(!data_ready){
		return;
	}

	var all_sections = document.getElementsByClassName("result_body");
    for(var i = 0; i < all_sections.length; i++){
        all_sections[i].style.display = "none";
    }
    if(section_name !== 'hideall'){
		document.getElementById(section_name+'_body').style.display = "block";
	}
}

function setOutlookData(data){
	var body_elem = document.getElementById('outlook_body');
	if(body_elem){
		Object.keys(data).forEach(field => {
			var field_elem_id = "o-"+field;
			var field_elem = document.getElementById(field_elem_id);
			console.log(field_elem_id);
			if(field_elem){
				field_elem.textContent = data[field];
			}
			
		});
	}
}

function setSummaryData(data){
	var body_elem = document.getElementById('summary_body');
	if(body_elem){
		Object.keys(data).forEach(field => {
			var field_elem_id = "s-"+field;
			var field_elem = document.getElementById(field_elem_id);
			console.log(field_elem_id);
			if(field_elem){
				field_elem.textContent = data[field];
			}
		});
		document.getElementById('s-timestamp').text = document.getElementById('s-timestamp').textContent.substring(0,10);
		
		var change = data['last'] - data['prevClose'];
		var changePercent  = change/data['prevClose']
		var arrow_img = ""
		if(change < 0){
			arrow_img = "<img src='https://csci571.com/hw/hw6/images/RedArrowDown.jpg'>"
		}
		if(change > 0){
			arrow_img = "<img src='https://csci571.com/hw/hw6/images/GreenArrowUp.jpg'>"
		}

		document.getElementById('s-change').innerHTML = change+arrow_img;
		document.getElementById('s-changePercent').innerHTML = changePercent+arrow_img;
	}
}

function setChartData(data){
	console.log(data);
	var date = new Date();
	var dateFormatted = date.getFullYear()+'-'+date.getDate()+'-'+(date.getMonth()+1);
	var chartTitle = "Stock Price "+document.querySelector('#search_bar input').value.toUpperCase()+" "+dateFormatted;

	var data1 = [];
	var data2 = [];

	data.forEach(element => {
		var x1 = x2 = Date.parse(element['date']);
		var y1 = element['close'];
		var y2 = element['volume'];
		data1.push([x1, y1]);
		data2.push([x2, y2]);
	});

	setHighChartsData(chartTitle, data1, data2);
}

function requestStockData(){
	var stnk = document.querySelector('#search_bar input').value
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var obj = JSON.parse(req.responseText);
			console.log(JSON.parse(obj['outlook']));
		    setOutlookData(JSON.parse(obj['outlook']));
		    setSummaryData(JSON.parse(obj['summary'])[0]);
		    setChartData(JSON.parse(obj['chart']));
			data_ready = true;
			displaySection('outlook');
	    }
	};
	req.open("GET", api_url+"?stnk="+stnk, true);
	req.send();
}

function emptyStockData(){
	displaySection('hideall');
	data_ready = false;
	document.querySelector('#search_bar input').value = '';
}