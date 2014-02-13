'use strict';

angular.module('gitHubApp')
  .controller('MainCtrl', function ($scope) {
    $scope.numOfDays;
    $scope.selectedCurrency;
    $scope.resultsDate;
    $scope.resultsDifference;
    $scope.submitLabel = 'Submit';
    $scope.baseUrl = 'http://openexchangerates.org/api/';
    $scope.APPKEY = 'app_id=19960cf6be094b199d6b4381b44842a0';
    $scope.MILLISECONDS = 1000;

    $scope.dateCalculator = function (date, days){
        var y = date.getFullYear(),
            m = date.getMonth(),
            d = date.getDate();
        d += days;
        return new Date(y, m, d);
    };

    $scope.calculateGreatestDifference = function(rates, currency) {
        var sortedDates = Object.keys(rates).sort(),
            numOfDays = sortedDates.length,
            startDate = sortedDates[0], 
            endDate = sortedDates[0], 
            greatestDiff = Math.abs(rates[startDate][currency] - rates[startDate][currency]),
            i, diff, d1, d2;
        
        for(i = 0; i < numOfDays - 1; i++) {
            d1 = sortedDates[i];
            d2 = sortedDates[i+1];
            diff = Math.abs(rates[d1][currency] - rates[d2][currency]);
            if(diff > greatestDiff) {
                greatestDiff = diff;
                startDate = d1;
                endDate = d2;
            }
        }
        updateResults({diff: greatestDiff.toFixed(5), start: startDate, end: endDate});
    };

    $scope.getFormattedDate = function (date) {
      var month = (date.getMonth() + 1).toString().length == 1? '0' + (date.getMonth() + 1) : date.getMonth(),
        day = date.getDate().toString().length == 1? '0' + date.getDate(): date.getDate();
      return date.getFullYear() + '-' + month + '-' + day;
    };

    $scope.updateResults = function(results) {
        var startDate = new Date(results.start * MILLISECONDS),
            formattedStart = getFormattedDate(startDate), 
            endDate = new Date(results.end * MILLISECONDS),
            formattedEnd = getFormattedDate(endDate); 
        $scope.resultsDate = formattedStart + ' / ' + formattedEnd;
        $scope.resultsDifference = results.diff;
        // $('.results-date h1').html(formattedStart + ' / ' + formattedEnd);
        // $('.results-difference h1').html(results.diff);
    };

    $scope.submit = function(e) {
      var days = Number($scope.numOfDays),
        currency = $scope.selectedCurrency,
        now = new Date(Date.now()),
        self = this,
        requestCounter = 0,
        data = {};

     // Don't allow non-numeric entries   
    if(isNaN(days)) {
        alert('value is not a number');
        return;
    } 

    // Don't allow fractional number of days
    if((days % 1) != 0) {
        alert('value is not an integer');
        return;
    }

    // Currency must be selected
    if(currency.length == 0) {
        alert('you must select a currency');
        return;
    }

    // Show Loading text and disable input
    //$(this).html('Loading...');
    //$('#num-days').attr('disabled',true);
    $scope.submitLabel = 'Loading...';
    // Loop through the last n days and call the historical data endpoint
    // to get those exchange rates
    // TODO: Really slow when days > 50, cache the first 365 days on initial page load
    for(var i = 0; i <= days; i++) {

        var newDate = $scope.dateCalculator(now, 0 - i),
            dateParam = $scope.getFormattedDate(newDate), //y + '-' + m + '-' + d,
            url = $scope.baseUrl + 'historical/' + dateParam + '.json?' + $scope.APPKEY;
        
        // For current date, call the latest.json endpoint    
        if( i == 0) {
            url = $scope.baseUrl + 'latest.json?' + $scope.APPKEY;
        }

        // call the exchange rate endpoint for a given date
        $.ajax({
            url: url,
            success: function (json) {
                // Store all responses and allow them to be referenced by their timestamp
                data[json.timestamp] = json.rates;
                requestCounter++;

              // Since calls are async, only calculate the difference when we've got all data back
              // Should have current date data, plus n historical days of data -> n + 1
              if(requestCounter == (days + 1)) {
                calculateGreatestDifference(data, currency);

                // Remove Loading text and show Submit text
                // Re-enable input box
                $scope.submitLabel = 'Submit';
                //$('#num-days').attr('disabled',false);
              }
            }, error: function () {
              requestCounter++;
            }
        });
    }

    }

  });
