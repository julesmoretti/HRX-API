'use strict';

angular
  .module('api.controllers')
  .controller('CompCtrl', ['$scope', 'New_users_const', 'Companies_const', 'HR_chapters_const', '$http', '$state', '$stateParams',
    function( $scope, newUsersConst, companiesConst, hrChapters, $http, $state, $stateParams ) {
      $scope.currentID = JSON.parse( $stateParams.id );

      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 16 };

      $scope.searchCall = function( index ) {

        console.log( 'searchCall', index );

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode( { "address": $scope.companies[ index ].address }, function(results, status) {

          console.log('$scope.textfield', $scope.companies[ index ].address );
          if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            var location = results[0].geometry.location,
                lat      = location.lat(),
                lng      = location.lng();
            console.log("passed", location, index);
            // $scope.myMap.panTo(location);
            $scope.companies[ index ].latitude = lat;
            $scope.companies[ index ].longitude = lng;
            $scope.$apply();
          } else {
            console.log("failed", results, status);

          }
        });
      };

      // prevents google map from changing center point
      $scope.recenterMap = function( index ) {
        if ( !$scope.companies[ index ].center ) {
          $scope.companies[ index ].center = {};
        }

        if ( $scope.companies[ index ].latitude ) {
          $scope.companies[ index ].center.latitude = $scope.companies[ index ].latitude;
          $scope.companies[ index ].center.longitude = $scope.companies[ index ].longitude;
        }
      };

      $scope.updateCompany = function( index ) {
        console.log( "updateCompany", index );
        // console.log( $scope.companies[ index ] );
        // console.log( JSON.stringify( $scope.companies[ index ] ) );

        if ( typeof index !== "number" ) {
          console.log("NUMBER ERROR");
          $scope.errorMessage = "Error with query (missing company index) - report to admin";
          return;
        } else if ( !$scope.companies[ index ] ) {
          console.log("COMPANY INDEX ERROR");
          $scope.errorMessage = "Error with query (missing company data) - report to admin";
          return;
        } else if ( $scope.companies[ index ].password === undefined || $scope.companies[ index ].password.length === 0 ) {
          console.log("PASSWORD ERROR");
          $scope.errorMessage = "Please add a password";
          return;
        }

        var company = JSON.parse( JSON.stringify( $scope.companies[ index ] ) );

        delete company.$$hashKey;
        delete company.edit;
        delete company.center;
        delete company.password;

        var company_mysql_updates = "";

        for ( var keys in company ) {


          if ( company[ keys ] === null ) {
            delete company[ keys ];

          } else if ( keys === "address" ) {
            if ( company_mysql_updates.length ) company_mysql_updates = company_mysql_updates + ", ";

            company_mysql_updates = company_mysql_updates + "address = '" + company[ keys ] + "'";

          } else if ( keys === "www" ) {
            if ( company_mysql_updates.length ) company_mysql_updates = company_mysql_updates + ", ";

            company_mysql_updates = company_mysql_updates + "www = '" + company[ keys ] + "'";

          } else if ( keys === "logo" ) {
            if ( company_mysql_updates.length ) company_mysql_updates = company_mysql_updates + ", ";

            company_mysql_updates = company_mysql_updates + "logo = '" + company[ keys ] + "'";

          } else if ( keys === "latitude" ) {
            if ( company_mysql_updates.length ) company_mysql_updates = company_mysql_updates + ", ";

            company_mysql_updates = company_mysql_updates + "latitude = " + company[ keys ];

          } else if ( keys === "longitude" ) {
            if ( company_mysql_updates.length ) company_mysql_updates = company_mysql_updates + ", ";

            company_mysql_updates = company_mysql_updates + "longitude = " + company[ keys ];
          }
        }

        // sends token to API
        var req = {
          method: 'GET',
          url: 'http://api.hrx.club/updatecompany',
          // url: 'http://localhost:5000/updatecompany',
          params: { 'password': $scope.companies[ index ].password, 'company_mysql_updates': company_mysql_updates, 'company_updates': JSON.stringify( company ) }
        };

        $http( req ).
          success( function( data, status, headers, config ) {

            // data responses
            // alert( "data: "+ data );
            // { responseCode: 200, message: 'Thank you all clear here!' }

            // { responseCode: 401, message: 'no username found' }
            // { responseCode: 400, message: 'no header detected' }

            if ( data.responseCode === 200 ) {
              $scope.errorMessage = null;
              $scope.companies[ $scope.currentID ].password = "";
              $state.go( "^" );
              // $scope.companies[ index ].edit = !$scope.companies[ index ].edit;
              // alert( "Response code: " + data.responseCode + " - " + data.message + " - User ID: " + typeof data.user_id + "" + data.user_id );
            } else {
              alert( "Response code: " + data.responseCode + " - " + data.message );
              $scope.companies[ $scope.currentID ].password = "";
              $scope.errorMessage = data.message;
            }
          }).
          error( function( data, status, headers, config ) {
            // something called here
            alert( "Error establishing a connection to API: "+ data+" - And status: " + status );

            // need to handle errors like time outs etc...
          });


      };

      var styles = [
                        {
                            "featureType": "all",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "saturation": "0"
                                },
                                {
                                    "color": "#5bc0de"
                                },
                                {
                                    "lightness": "0"
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 16
                                },
                                {
                                    "weight": "0.1"
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "25"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "25"
                                },
                                {
                                    "weight": 1.2
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "23"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "17"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "5"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "10"
                                },
                                {
                                    "weight": 0.2
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "15"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": "15"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": "-61"
                                },
                                {
                                    "gamma": "1"
                                },
                                {
                                    "saturation": "0"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#2b353c"
                                },
                                {
                                    "saturation": "30"
                                },
                                {
                                    "lightness": "13"
                                }
                            ]
                        }
                    ];

      $scope.mapOptions = {
        styles: styles,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        },
        // disableDefaultUI: false // disables all Google map UI
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false
      };

    }]);
