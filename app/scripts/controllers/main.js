'use strict';

angular.module('solaceApp')
  .controller('MainCtrl', [ '$scope', '$http', function ($scope, $http) {
  
  	$scope.msg;
  	
    var messages = [];
    var socket = io.connect('http://localhost:9000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
 
    socket.on('message', function (data) {
        if(data.message) {
            alert(JSON.stringify(data.message));
            $scope.msg = JSON.stringify(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            $scope.$digest();
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text });
    };
 
 
 
  
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  }]);
