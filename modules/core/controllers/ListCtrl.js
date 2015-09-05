'use strict';

// var app = angular.module('api.controllers', ['api.constants']);
angular
  .module('api.controllers', ['api.constants'])
  .controller('ListCtrl', ['$scope', 'New_users_const', 'Companies_const', 'HR_chapters_const', '$http', '$state', '$stateParams',
    function( $scope, newUsersConst, companiesConst, hrChapters, $http, $state, $stateParams ) {
      $scope.new_users = newUsersConst;
      $scope.companies = companiesConst;
      $scope.hr_chapters = hrChapters;
    }]);
