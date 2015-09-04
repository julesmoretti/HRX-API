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

      $scope.recenterMap = function( index ) {
        console.log('recenterMap');
        if ( $scope.companies[ index ].center && $scope.companies[ index ].latitude ) {
          $scope.companies[ index ].center.latitude = $scope.companies[ index ].latitude;
          $scope.companies[ index ].center.longitude = $scope.companies[ index ].longitude;
        }
      };

      $scope.updateCompany = function() {
        console.log("updateCompany");
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
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false
        // disableDefaultUI: false
      };

    }]);
