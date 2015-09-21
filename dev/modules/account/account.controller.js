(function(){
    'use strict';

    angular.module('app.account')

    .controller("AccountCtrl", ["$scope", "UserAuth","$state","Auth", function($scope, UserAuth,$state, Auth) {
        
        // Check current authentication state
        UserAuth.state();
        
        // Login with facebook
        $scope.fb_login = function(){
            UserAuth.facebook();
        };
            
        // Logout method
        $scope.logout = function(){
            $state.go('login');  
            Auth.$unauth();        
        };
    }])


})();
