'use strict';

angular.module('c4tkApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
  
  	 $scope.write={};
  
  	 $scope.save = function(){
        socket.emit('send', { message: $scope.write.body, latitude: $scope.write.latitude, longitude: $scope.write.longitude});
    };

	var latitude, longitude;	
    var messages = [];
    var socket = io.connect('http://localhost:9000');
    var field = document.getElementById("field");
    $scope.recordedEvents = [];
 
    socket.on('message', function (data) {
        if(data.message) {
            var temp = new Object();
            
            $scope.msg = JSON.stringify(data.message);
            temp = JSON.stringify(data.message);
            $scope.recordedEvents.push(temp);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            addStore(data.latitude, data.longitude);
            $scope.$apply();
        }else {
            console.log("There is a problem:", data);
        }
    });
 

   
    
    
      var map;
  var nextStore = 0;
  var year = 1962;
  var month = 1;
  var colors = [];
  var unlock = false;
  var running = false;
	var r, b,g;
	
  function initialize() {
    var myOptions = {
      zoom: 2,
      center: new google.maps.LatLng(39,-96),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      backgroundColor: 'white',
      zoomControl: false,
      streetViewControl: false,
      panControl: false,
      styles: [
        {
          stylers: [
            { invert_lightness:true
            },{weight:0.1 },{visibility:"simplified"}
          ]
        },{
          featureType: "water",
          stylers: [
            { visibility: "on" },
            { lightness: -50 },
            { saturation: -100 }
          ]
        },{
          featureType: "administrative.province",
          elementType: "geometry",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "administrative.country",
          elementType: "geometry",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "water",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        }
      ]
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    fillColorArray();

    google.maps.event.addListener(map, 'mouseout', stop);
    google.maps.event.addListener(map, 'tilesloaded', function() {
      unlock = true;
    });
  }

  function start(){
      running = true;
  };

  function stop() {
    running = false;
  }


  var markersByMonth = [];
  for (var i = 0; i < 12; ++i) {
    markersByMonth.push([]);
  }

  function updateColors(year, month) {
    var markers = markersByMonth[month - 1];
    for (var i = 0, I = markers.length; i < I; ++i) {
      var inner = markers[i];
      var age = year - inner.year;
      if (age % 2) {
        var icon = inner.get('icon');
        icon.fillColor = colors[age];
        inner.notify('icon');
      }
    }
  }

  function addStore(latitude, longitude) {
    var location = new google.maps.LatLng(latitude, longitude);
    var outer = new google.maps.Marker({
      position: location,
      clickable: false,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity:1,
        fillColor: colors[0],
        strokeOpacity: 1.0,
        strokeColor: colors[0],
        strokeWeight: 100.0,
        scale: 10,
      },
      optimized: false,
      zIndex: year,
      map: map
    });

    var inner = new google.maps.Marker({
      position: location,
      clickable: false,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 1.0,
        fillColor: colors[0],
        strokeWeight: 0,
        scale: 0
      },
      optimized: false,
    });


    for (var i = 0; i <= 10; i++) {
      setTimeout(setScale(inner, outer, i / 10), i * 60);
    }
  }

  function setScale(inner, outer, scale) {
    return function() {
      if (scale == 1) {
        outer.setMap(null);
      } else {
        var icono = outer.get('icon');
        icono.strokeOpacity = Math.cos((Math.PI/2) * scale);
        icono.fillOpacity = icono.strokeOpacity * 0.5;
        icono.scale = Math.sin((Math.PI/2) * scale) * 15;
        outer.set('icon', icono);

        var iconi = inner.get('icon');
        var newScale = (icono.scale < 2.0 ? 0.0 : 2.0);
        if (iconi.scale != newScale) {
          iconi.scale = newScale;
          inner.set('icon', iconi);
          if (!inner.getMap()) inner.setMap(map);
        }
      }
    }
  }
 
  function fillColorArray() {
    var max = 198;
    for (var i = 0; i < 44; i++) {
      if (i < 11) { // red to yellow
        r = Math.floor((22 - i) * (max / 11));
        g = max;
        b = 0;
      } else if (i < 22) { // yellow to green
        r = Math.floor((22 - i) * (max / 11));
        g = max;
        b = 0;
      } else if (i < 33) { // green to cyan
        r = Math.floor((22 - i) * (max / 11));
        g = max;
        b = 0;
      } else { // cyan to blue
        r = Math.floor((22 - i) * (max / 11));
        g = max;
        b = 0;
      }
      colors[i] = 'rgb(' + r + ',' + g + ',' + b + ')';
    }
  }
    
    
    
    
    initialize();  
    
    start();
    
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        });
    }
 
  
    
  }]);
