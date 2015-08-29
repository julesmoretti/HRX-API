'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular
    .module('core')
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');
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
              .state('home', {
                url: '/',
                views: {
                  'home': {
                    templateUrl: 'modules/core/views/home.html',
                    controller: 'HomeController'
                  }
                }
              })

                  .state('home.login', {
                    url: 'login',
                    views: {
                      'home@': {
                        templateUrl: 'modules/core/views/login.html',
                        controller: 'LoginController'
                      }
                    }
                  })

                  .state('home.loginli', {
                    url: 'loginli',
                    views: {
                      'home@': {
                        templateUrl: 'modules/core/views/loginli.html',
                        controller: 'LoginLiController'
                      }
                    }
                  })

                  .state('home.map', {
                    url: 'map',
                    views: {
                      'home@': {
                        templateUrl: 'modules/core/views/map.html',
                        controller: 'MapController'
                      }
                    }
                  })

                      .state('home.map.skills', {
                        url: '/skills',
                        views: {
                          'skills@home.map': {
                            templateUrl: 'modules/core/views/skills.html',
                            controller: 'SkillsController'
                          }
                        }
                      })

                      .state('home.map.filter', {
                        url: '/filter',
                        views: {
                          'filter@home.map': {
                            templateUrl: 'modules/core/views/filter.html',
                            controller: 'FilterController'
                          }
                        }
                      })

                      .state('home.map.menu', {
                        url: '/menu',
                        views: {
                          'menu@home.map': {
                            templateUrl: 'modules/core/views/menu.html'
                            // controller: 'MenuController'
                          },
                          'menuList@home.map.menu': {
                            templateUrl: 'modules/core/views/menu-list.html',
                            controller: 'MenuController'
                          },
                          'menuFooter@home.map.menu': {
                            // template: '<div class="back-button ion-ios-arrow-back" ui-sref="home.map"></div><div class="main-title">Menu</div>',
                            template: '<div class="menuFooter"><div class="back-button ion-close" ui-sref="home.map"></div><div class="main-title"></div><div class="settings-button ion-gear-a" ui-sref="home.map.menu.settings"></div></div>'
                            // template: '<div class="back-button ion-android-close" ui-sref="home.map"></div><div class="main-title"></div><div class="settings-button ion-gear-a" ui-sref="home.map.menu.settings" ng-click="signOut()"></div>',
                            // controller: 'MenuController'
                          }
                        }
                      })

                          .state('home.map.menu.settings', {
                              url: '/settings',
                              views: {
                                // 'menu@': {
                                'settings@home.map.menu': {
                                  templateUrl: 'modules/core/views/settings.html',
                                  controller: 'SettingsController'
                                },
                                'menuFooter@home.map.menu': {
                                  template: '<div class="menuFooter openSettings"><div class="back-button ion-chevron-down" ui-sref="home.map.menu"></div>'
                                  // controller: 'SettingsController'
                                }
                              }
                          })

                          .state('home.map.menu.alumni', {
                              url: '/alumni',
                              views: {
                                // 'menu@': {
                                'alumni@home.map.menu': {
                                  templateUrl: 'modules/core/views/alumni.html',
                                  controller: 'AlumniController'
                                },
                                'menuFooter@home.map.menu': {
                                  template: '<div class="menuFooter"><div class="back-button ion-chevron-left" ui-sref="home.map.menu"></div><div class="main-title"></div></div>'
                                  // controller: 'AlumniController'
                                }
                              }
                          })

                              .state('home.map.menu.alumni.alumn', {
                                  url: '/:id',
                                  views: {
                                      // 'menu@': {
                                      'alumn@home.map.menu.alumni': {
                                        templateUrl: 'modules/core/views/alumn.html',
                                        controller: 'AlumnController'
                                      },
                                      'menuFooter@home.map.menu': {
                                        template: '<div class="menuFooter"><div class="back-button ion-chevron-left" ui-sref="home.map.menu.alumni"></div><div class="main-title"></div><div ng-if="currentID === $storage.user_id" class="settings-button ion-edit" ui-sref="home.map.menu.profile"></div></div>',
                                        controller: 'AlumnController'
                                      }
                                  }
                              })

                          .state('home.map.menu.companies', {
                              url: '/companies',
                              views: {
                                // 'menu@': {
                                'companies@home.map.menu': {
                                  templateUrl: 'modules/core/views/companies.html',
                                  controller: 'CompaniesController'
                                },
                                'menuFooter@home.map.menu': {
                                  template: '<div class="menuFooter"><div class="back-button ion-chevron-left" ui-sref="home.map.menu"></div><div class="main-title"></div></div>'
                                  // controller: 'CompaniesController'
                                }
                              }
                          })

                              .state('home.map.menu.companies.company', {
                                  url: '/:id',
                                  views: {
                                      // 'menu@': {
                                      'company@home.map.menu.companies': {
                                        templateUrl: 'modules/core/views/company.html',
                                        controller: 'CompanyController'
                                      },
                                      'menuFooter@home.map.menu': {
                                        template: '<div class="menuFooter"><div class="back-button ion-chevron-left" ui-sref="home.map.menu.companies"></div></div>'
                                        // controller: 'CompanyController'
                                      }
                                  }
                              })

                          .state('home.map.menu.profile', {
                              url: '/profile',
                              views: {
                                // 'menu@': {
                                'profile@home.map.menu': {
                                  templateUrl: 'modules/core/views/profile.html',
                                  controller: 'ProfileController'
                                },
                                'menuFooter@home.map.menu': {
                                  template: '<div class="menuFooter"><div class="back-button ion-chevron-left" ui-sref="home.map.menu"></div><div class="main-title"></div></div>'
                                  // controller: 'ProfileController'
                                }
                              }
                          });
        }
    ]);
