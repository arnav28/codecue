(function () {
    'use strict';

    angular.module('app.account')
    
    // firebase authentication wrapper
        .service("Auth", ["$firebaseAuth", "FirebaseUrl", function ($firebaseAuth, FirebaseUrl) {
            var ref = new Firebase(FirebaseUrl);
            return $firebaseAuth(ref);
        }])
        
    // Authentication Service
        .service("UserAuth", ["$rootScope", "Auth", "FireDB", "$state", function ($rootScope, Auth, FireDB, $state) {

            // Facebook Login
            this.facebook = function () {
                Auth.$authWithOAuthPopup("facebook").then(function (authData) {
                }).catch(function (error) {
                    console.error("Authentication failed:", error);
                });
            };
    
            // Google Login
            this.google = function () {
                Auth.$authWithOAuthPopup("google").then(function (authData) {
                }).catch(function (error) {
                    console.error("Authentication failed:", error);
                });
            };
    
            // Check authentication state
            this.state = function () {
                return Auth.$onAuth(function (user) {
                    if (user) {
                        var ref = FireDB.child("Users").child(user.uid);
                        // Check is user already exists
                        ref.once('value', function (snap) {
                            var name = getName(user);
                            if (snap.val() === null) {
                                // IF NOT: save the user's profile into Firebase 
                                ref.set({
                                    provider: user.provider,
                                    name: name,
                                    date: Firebase.ServerValue.TIMESTAMP,
                                    photo: user.facebook.cachedUserProfile.picture.data.url
                                });
                            } else {
                                // ELSE: Update profile picture from social provider
                                ref.update({
                                    photo: user.facebook.cachedUserProfile.picture.data.url
                                });
                            }                         
                            $state.go('app.dashboard');
                        });
                    } else {
                        // FAIL: Redirect to login
                        $state.go('login');
                    }
                });
            };
    
            // Get full name depending on social provider
            function getName(user) {
                if (user.provider == 'facebook') {
                    return user.facebook.cachedUserProfile.name;
                }
            }

        }]);

})();

