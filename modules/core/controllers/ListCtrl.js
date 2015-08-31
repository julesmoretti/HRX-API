var app = angular.module('api.controllers', ['api.constants']);

    app.controller('ListCtrl', ['$scope', 'New_users_const', 'Companies_const', 'HR_chapters_const', function( $scope, newUsersConst, companiesConst, hrChapters ) {
      $scope.new_users = newUsersConst;
      $scope.companies = companiesConst;
      $scope.hr_chapters = hrChapters;

      $scope.openLink = function() {
        console.log("openLink")
      };

      $scope.map;
      function initMap() {
        $scope.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8
        });
      }

    }]);
