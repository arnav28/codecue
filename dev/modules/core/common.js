(function () {
    'use strict';

    angular.module('app.core')

    .constant('FirebaseUrl', 'https://codecue.firebaseio.com/')

    // firebase root reference
        .service("FireDB", ["FirebaseUrl", function (FirebaseUrl) {
            var ref = new Firebase(FirebaseUrl);
            return ref;
        }])  
        
        
    // Service for handling tags 
        .service("TagService", ["FireDB", "$firebaseArray", function (FireDB, $firebaseArray) {
            //get all tags
            this.all = function () {
                var list = $firebaseArray(FireDB.child("Tags"));
                return list;
            }
        }]);

})();
