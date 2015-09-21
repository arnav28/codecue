(function () {
    'use strict';

    angular.module('app.profile')


        .service("ProfileService", ["FireDB", "$firebaseArray","$firebaseObject", function (FireDB, $firebaseArray, $firebaseObject) {
            
            // Get User Profile
            this.get = function (uid) {
                var object = $firebaseObject(FireDB.child("Users").child(uid));
                return object;
            };
            
            // Save User profile
            this.save = function (data, uid) {
                var ref = FireDB.child("Users").child(uid);
                ref.update({
                    name: data.name,
                    email: data.email,
                    website: data.website,
                    skills: data.skills
                });
            };
        }]);

})();
