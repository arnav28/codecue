(function () {
    'use strict';

    angular.module('app.dashboard')
                
    // Data Service
        .service("DashboardService", ["FireDB", "$state", "$firebaseArray", "$firebaseObject","FormatPost", function (FireDB, $state, $firebaseArray, $firebaseObject, FormatPost) {
            // Submit new post for current User
            this.newPost = function (post, currentAuth) {
                var message = FormatPost.url(post.Msg); // Check for URL and add anchor tag
                var ref = FireDB.child("Posts");
                ref.push({
                    author: currentAuth.uid,
                    message: message,
                    tag: post.Tag.Name,
                    tagId: post.Tag.$id,
                    time: Firebase.ServerValue.TIMESTAMP
                });
            };
            
            // Retrieve all posts on page load
            this.allPosts = function () {
                var list = $firebaseArray(FireDB.child("Posts").limitToLast(50));
                return list;               
            };
            
            // Load posts depeding on selected tag
            this.getPosts = function (id) {
                var list = $firebaseArray(FireDB.child("Posts").orderByChild("tagId").equalTo(id).limitToLast(50));
                return list;
            };
            // Toggle post like
            this.toggleLike = function (uid, postId) {
                var ref = FireDB.child("Likes").child(postId).child(uid);
                var ref2 = FireDB.child("UserActivity").child(uid).child(postId);
                ref.once('value', function (snap) {
                    if (snap.val() === null) {
                        ref.set(true, onComplete); // Set in likes node
                        ref2.set(true); // Set in user activity node
                    } else {
                        ref.set(null, onComplete);
                        ref2.set(null);
                    }
                });
            };
                // Callback for toggleLike
                var onComplete = function (error) {
                    if (error) {
                        console.log('failed');
                    } else {
                        //console.log('succeeded');
                    }
                };
                
            // Count total likes for each post
            this.fetchLikes = function (postId) {
                var list = $firebaseArray(FireDB.child("Likes").child(postId));
                return list;
            };

            // Check is current user has liked the post
            this.checkLikes = function (uid, postId) {
                var obj =  $firebaseObject(FireDB.child("UserActivity").child(uid).child(postId)); 
                return obj;
            };

        }])
        
        .service("FormatPost", ["FireDB", function (FireDB) {
            
            // Check for url --- http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
            this.url = function (text) {
                var exp = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                return text.replace(exp,"<a target='_blank' href='$1'>$1</a>"); 
            };
            
        }]);
        
      

})();
