angular.module("interactivemap-gui", [])

.controller("SlideshowCtrl", function($http) {
  var self = this;
  this.entries = [];
  this.slideShows = [];
  this.slideShow = 0;

  this.selectedItemS0;
  this.selectedItemS1;
  this.selectedItemS2;
  
  this.change = function(n) {
   this.entries = this.slideShows[n];
   this.slideShow = n;
   console.log(this.slideShow);
  };

  this.chooseItemS0 = function(n) { // Ugly
   this.selectedItemS0 = n; 
  };
  this.chooseItemS1 = function(n) {
   this.selectedItemS1 = n; 
  };
  this.chooseItemS2 = function(n) {
   this.selectedItemS2 = n; 
  };

  function onSuccess(csvData, status, headers, config) {
    // Convert CSV to JSON.
    console.log("onSuccess");
    var jsonData = Papa.parse(csvData, {header: true});
    //console.log(jsonData);
    self.slideShows.push(jsonData.data);
    //console.log('entries after http', self.entries);
  }

  // Load CSV data.
  $http.get('data/data1.csv')
    .success(onSuccess);

  $http.get('data/data2.csv')
    .success(onSuccess);

  $http.get('data/data3.csv')
    .success(onSuccess);

});
 