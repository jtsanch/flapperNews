var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', [function(){ 
	var o = { 
		posts: [] 
	};

	return o;
}]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider.state('home',{
			url:'/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		});

		$stateProvider.state('post', {
			url:'/post/{id}',
			templateUrl: '/post.html',
			controller: 'PostCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.controller('PostCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){
		$scope.post = posts.posts[$stateParams.id];
		$scope.upvoteComment = function(comment){
			comment.upvotes +=1;
		};
		$scope.addComment = function(){
			if($scope.body === ''){return;}
			$scope.post.comments.push({
				author:"Starry Eyes",
				body:$scope.body,
				upvotes:1
			});
			$scope.body = '';
		};
	}]);

app.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts){

	$scope.posts = posts.posts;

	$scope.addPost = function(){
		$scope.posts.push({ title: $scope.title, 
							link: $scope.link, 
							upvotes:1,
							comments:[
								{author: 'Joe', body: 'Cool Post!', upvotes:2},
								{author: 'Karl', body: 'What about that', upvotes:1}
							]});
		$scope.title = "";
		$scope.link = "";
	};

	$scope.upvotePost = function(post) {
		post.upvotes += 1;
	};
}]);