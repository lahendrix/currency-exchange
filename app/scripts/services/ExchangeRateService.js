angular.module('currencyExchangeApp')
.service('ExchangeRateService', function ($http) {
	var baseUrl = 'http://openexchangerates.org/api/',
        APPKEY = 'app_id=19960cf6be094b199d6b4381b44842a0';
	

  	return {
  		getHistoricalData: function (dateParam, successCallback, errorCallback) {
  			var url = baseUrl + 'historical/' + dateParam + '.json?' + APPKEY;
  			console.log('histoical: ', url);
  			$http.jsonp(url + '?callback=successCallback')
			.success(function(data, status, headers, config) {
				console.log('success', data);
			    // successCallback(data, status, header, config);
			 })
			.error(function(data, status, headers, config) {
		    	// errorCallback(data, status, headers, config);
		  	});
  		},

  		getLatestData: function (successCallback, errorCallback) {
  			var url = baseUrl + 'latest.json?' + APPKEY;
  			console.log('latest: ', url);
  			$http.jsonp(url + '?callback=successCallback')
			.success(function(data, status, headers, config) {
				console.log('success', data);
			    // successCallback(data, status, header, config);
			 })
			.error(function(data, status, headers, config) {
		    	// errorCallback(data, status, headers, config);
		  	});
  		}
  	}
});