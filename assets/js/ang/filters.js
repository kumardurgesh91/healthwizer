'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        console.log(input, start , " Start");
        return input.slice(start);
    }
	});