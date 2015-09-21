(function () {
    'use strict';

    angular.module('app.dashboard')

        .controller("DashboardCtrl", ["$scope", "currentAuth", "TagService", "DashboardService", "$modal", function ($scope, currentAuth, TagService, DashboardService, $modal) {

            // Set default tag
            $scope.tag = {
                active: 'T00'
            };
            // Retrieve tags
            $scope.tags = TagService.all();  
                 
            // Retrieve all posts on page load
            $scope.posts = DashboardService.allPosts(); 
            // Load posts depeding on selected tag
            $scope.loadPosts = function () {
                if ($scope.tag.active == 'T00') {
                    $scope.posts = DashboardService.allPosts();
                } else {
                    $scope.posts = DashboardService.getPosts($scope.tag.active);
                }
            };
            
            // Toggle post like
            $scope.toggleLike = function (postId) {
                DashboardService.toggleLike(currentAuth.uid, postId);
            };

            // Open modal for submiting new post
            $scope.open = function (size) {
                var modalInstance = $modal.open({
                    templateUrl: 'newPostModal.html',
                    controller: 'PostCtrl',
                    resolve: {
                        "currentAuth": ["Auth", function (Auth) {
                            return Auth.$requireAuth();
                        }]
                    }
                });
            };

        }])


        .controller("PostCtrl", ["$scope", "currentAuth", "DashboardService", "TagService", "$modalInstance","$timeout", function ($scope, currentAuth, DashboardService, TagService, $modalInstance, $timeout) {
            
            // Retrieve tags for modal
            $scope.tags = TagService.all();
            
            // Submit new post
            $scope.newPost = function (post) {
                // Check if tag is selected
                if (post.Tag) {
                    DashboardService.newPost(post, currentAuth);
                    $modalInstance.close(); // close modal on submit
                } else {
                    $scope.message = "Tag is required";
                    $timeout(function () {
                        $scope.message = null;
                    }, 4000);
                };
            };
            
            // Close modal
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }])

        .controller("LikesCtrl", ["$scope", "Auth", "DashboardService", function ($scope, Auth, DashboardService) {
            
            // Count total likes for each post
            $scope.count = DashboardService.fetchLikes($scope.post.$id);
            Auth.$onAuth(function (user) {
                if (user !== null) {
                    // Check is current user has liked the post
                    $scope.liked = DashboardService.checkLikes(user.uid, $scope.post.$id);
                }
            });

        }]);


})();
