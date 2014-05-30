'use strict';

angular.module('solaceApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
