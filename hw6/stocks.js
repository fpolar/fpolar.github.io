function requestStockData(e){
	var stnk = e.value;
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       document.getElementById("results").innerHTML = req.responseText;
	    }
	};
	req.open("GET", "https://csci-gcp-stocks.wn.r.appspot.com/stonks?stnk="+stnk, true);
	req.send();
}