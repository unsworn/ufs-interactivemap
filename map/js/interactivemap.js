angular.module("interactivemap", [])

.controller("SlideshowCtrl", function($http) {
  var self = this;
  this.entries = [];
  this.slideShows = [];
  var current = 0;
  
  this.change = function() {
    if (current === 0) {
      this.entries = this.slideShows[1];
      current = 1;
    } else {
      this.entries = this.slideShows[0];
      current = 0;
    }
  };

  function onSuccess(csvData, status, headers, config) {
    // Convert CSV to JSON.
    var jsonData = Papa.parse(csvData, {header: true});
    self.slideShows.push(jsonData.data);
    console.log('entries after http', self.entries);
  }

  // Load CSV data.
  $http.get('data/nature.csv')
    .success(onSuccess);

  $http.get('data/places.csv')
    .success(onSuccess);

});
 