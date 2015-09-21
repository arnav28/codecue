(function () {
    'use strict';

    angular.module('app.core', [
        'ui.bootstrap',
        'ui.router',
        'firebase',
        'ngSanitize'
    ])

        .run(["$rootScope", "$state", function ($rootScope, $state) {

            $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
                // We can catch the error thrown when the $requireAuth promise is rejected
                // and redirect the user back to the home page
                if (error === "AUTH_REQUIRED") {
                    $state.path("login");
                }
            });

        }])

        .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                
                .state("login", {
                    url: '/login',
                    controller: "AccountCtrl",
                    templateUrl: "modules/account/login.html",
                    resolve: {
                        "currentAuth": ["Auth", function (Auth) {
                            return Auth.$waitForAuth();
                        }]
                    }
                })
                
                // setup an abstract state for the Main Application tabs directive
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'modules/layout/app.html',
                    controller: "AccountCtrl"
                })
                
                .state('app.dashboard', {
                    url: '/dashboard',
                    views: {
                        "": {
                            templateUrl: "modules/dashboard/dashboard.html",
                            controller: "DashboardCtrl",
                            resolve: {
                                "currentAuth": ["Auth", function (Auth) {
                                    return Auth.$requireAuth();
                                }]
                            }
                        }
                    }

                })
                
                .state('app.profile', {
                    url: '/profile',
                    views: {
                        "": {
                            templateUrl: "modules/profile/profile.html",
                            controller: "ProfileCtrl",
                            resolve: {
                                "currentAuth": ["Auth", function (Auth) {
                                    return Auth.$requireAuth();
                                }]
                            }
                        }
                    }

                });

            $urlRouterProvider.otherwise('/login');


        }]);

})();
