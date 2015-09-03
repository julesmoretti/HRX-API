var app = angular.module('api.controllers', ['api.constants']);

    app.controller('ListCtrl', ['$scope', 'New_users_const', 'Companies_const', 'HR_chapters_const', function( $scope, newUsersConst, companiesConst, hrChapters ) {
      $scope.new_users = newUsersConst;
      $scope.companies = companiesConst;
      $scope.hr_chapters = hrChapters;
      $scope.searchbox = {};
      $scope.textfield = "";

      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 16 };

      $scope.openLink = function() {
        console.log("openLink")
      };

      $scope.searchCall = function( index ) {

        console.log( 'searchCall', index );

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode( { "address": $scope.companies[ index ].input }, function(results, status) {

          console.log('$scope.textfield', $scope.companies[ index ].input );
          if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            var location = results[0].geometry.location,
                lat      = location.lat(),
                lng      = location.lng();
            console.log("passed", location);
            // $scope.myMap.panTo(location);
            $scope.companies[ index ].center = { latitude: lat, longitude: lng };
            $scope.$apply();
          } else {
            console.log("failed", results, status);

          }
        });
      }



    }]);
