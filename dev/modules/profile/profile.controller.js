(function () {
    'use strict';

    angular.module('app.profile')

        .controller("ProfileCtrl", ["$scope", "currentAuth", "ProfileService","$timeout", function ($scope, currentAuth, ProfileService, $timeout) {
            
            // Get current user profile
            $scope.user = ProfileService.get(currentAuth.uid);
            
            // Update profile -- three way data binding
            $scope.updateProfile = function (data) {
                $scope.user.$save().then(function () {
                    $scope.message = "Profile updated successfully";
                }).catch(function (error) {
                    $scope.message = "Error...try again"
                });
                $timeout(function () {
                    $scope.message = null;
                }, 4000);
            };

        }]);


})();
