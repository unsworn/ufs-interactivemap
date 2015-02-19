angular.module("interactivemap", [
  'ngRoute'
])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
      templateUrl: 'views/slideshow.tpl.html',
      controller: 'AppCtrl',
      controllerAs: 'appCtrl',
      resolve: {
        done: function(slideshows) {
          return slideshows.loadAllSlideshows();
        }

      }
    }
  );

  $locationProvider.html5Mode(true);
})

// We have our data here.
.factory('slideshows', function($http, $q) {

  var state = {
    slideshows: [],
    currentSlideshow: undefined,
    currentSlideshowIndex: undefined
  };
  
  // Load Slideshows
  $http.get('data/nature.csv').success(onSuccess);
  $http.get('data/places.csv').success(onSuccess);

  function onSuccess(csvData, status, headers, config) {
    // Convert CSV to JSON.
    var jsonData = Papa.parse(csvData, {header: true});
    state.slideshows.push(jsonData.data);
    //console.log('entries after http', self.entries);
  }

  // Returns a promise
  function loadSlideshow(url) {
    return $http.get(url);
  }

  var api = {
    loadAllSlideshows: function() {
      var naturePromise = loadSlideshow('data/nature.csv');
      var placesPromise = loadSlideshow('data/places.csv');

      return $q.all([naturePromise, placesPromise]).then(function(csvSlideshows) {
        console.log('csvSlideshows', csvSlideshows);
        // Parse CSV
        state.slideshows = csvSlideshows.map(function(csvSlideshow) {
          return Papa.parse(csvSlideshow.data, {header: true}).data;
        });

        console.log('state', state);

      });
    },

    loadData: function(url) {
      return loadSlideshow(url);
    },

    setCurrent: function(slideshowIdx) {
      state.currentSlideshowIndex = slideshowIdx;
      state.currentSlideshow = state.slideshows[slideshowIdx];
    },

    getState: function() {
      return state;
    },

    getCurrent: function() {
      return state.currentSlideshow;
    },

    getAll: function() {
      return state.slideshows;
    },

    isCurrentSlideshow: function(slideshowIndex) {
      return state.currentSlideshowIndex === slideshowIndex;
    }
    //getEntries
  };

  return api;
})


.controller('AppCtrl', function(slideshows) {
  var self = this;

  // Hardcoded for now.
  slideshows.setCurrent(0);

  self.slideshows = slideshows.getAll();
  self.state = slideshows.getState();

  self.changeSlideshow = function(idx) {
    slideshows.setCurrent(idx);
  };
})

.controller('SlideshowCtrl', function(slideshows) {
  var self = this;

  self.getSlides = function() {
    return slideshows.getCurrent();
  }
  
  console.log('slides', self.slides);
  self.currentSlideIndex = 1;

  self.isCurrent = function(myIndex) {
    return slideshows.isCurrentSlideshow(myIndex);
  }

  self.next = function() {
    self.currentSlideIndex++;

    if(self.currentSlideIndex > self.getSlides().length) {
      self.currentSlideIndex = 1;
    }

    console.log('index', self.currentSlideIndex);
  };

  self.prev = function() {
    self.currentSlideIndex--;

    if(self.currentSlideIndex < 1) {
      self.currentSlideIndex = self.getSlides().length;
    }

    console.log('index', self.currentSlideIndex);
  };

})

.directive('snapAnimatedSvg', function($http) {
  return {
    //template: '<svg src="{{url}}" /> ng-include="url"></span>',
    link: function(scope, el, attr) {

      var svgEl = el.find('svg');
      var svgId = svgEl.attr('id');
      var snapSvg = Snap.select('#' + svgId);

      //console.log('el.children', el.children());
      console.log('svgEl', svgEl.attr('id'));
      //console.log('svgElRaw', svgEl[0]);

      switch(svgId) {
        case 'lineGroup':
          doLineAnimation(snapSvg);
          break;
        case 'areaGroup':
          doAreaAnimation(snapSvg);
          break;
      }

      function doLineAnimation(svg) {
        //console.log('svg', svg);
        var lineGroup = Snap.select('#lineGroup');
        var lineGroupArray = lineGroup.selectAll('path');
        var i = 0;

        function animateLineGroup() {
          lineGroupArray[i].animate({'stroke-dashoffset': 0}, 1000, mina.bounce, animateLineGroup);
          i++;
          //console.log(i);
        
          if(i > lineGroupArray.length - 1) {
           return;
          }
        };

        animateLineGroup();
      }

      function doAreaAnimation(svg) {
        var areaGroup = Snap.select('#areaGroup');
        var areaGroupArray = areaGroup.selectAll('path');
        var i = 0;

        function animateAreaGroup() {
          areaGroupArray[i].animate({'opacity': 0.3}, 1000, mina.easein, animateAreaGroup);
          i++;
          //console.log(i);
        
          if(i > areaGroupArray.length - 1) {
           return;
          }
        };

        animateAreaGroup();
      }
    },

  };
});


 