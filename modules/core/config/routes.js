'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular
    .module('api')
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            // $urlRouterProvider.otherwise('/');
            $urlRouterProvider.otherwise("/");
            // $urlRouterProvider.otherwise('/home/map');
            // $urlRouterProvider.otherwise('/map/filter');

            /**
             * @ngdoc event
             * @name core.config.route
             * @eventOf core.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the path is `'/'`, route to home
             * */
            $stateProvider
              // .state('home', {
              //   url: "/",
              //   templateUrl: "modules/core/views/home.html",
              //   controller: "ListCtrl"
              // })

              .state('home', {
                url: '/',
                views: {
                  'home': {
                    templateUrl: 'modules/core/views/home.html',
                    controller: 'ListCtrl'
                  }
                }
              })

              // .state('home.company', {
              //   url: "company/:id",
              //   templateUrl: "modules/core/views/home.company.html",
              //   controller: "CompCtrl"
              // });

              .state('home.company', {
                url: 'company/:id',
                views: {
                  'company': {
                    templateUrl: 'modules/core/views/home.company.html',
                    controller: 'CompCtrl'
                  }
                }
              });
        }
    ]);
