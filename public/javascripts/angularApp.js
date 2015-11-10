var app = angular.module('flapperNews', ['ui.router', '$http']);

app.factory('posts', ['$http', function($http){ 
	var o = { 
		posts: [] 
	};

	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	}

	o.getPost = function(id){
		return $http.get('/posts/' + id).success(function(data){
			angular.copy(data, o.post)
		});
	}

	o.create = function(post){
		return $http.post('/posts', post).success(function(data){
			o.posts.push(data);
		});
	}

	o.upvote = function(post){
		return $http.post('/posts/' + post._id + '/upvote').success(function(data){
			post.upvotes += 1;
		});
	}
	return o;
}]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider.state('home',{
			url:'/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		});

		$stateProvider.state('post', {
			url:'/post/{id}',
			templateUrl: '/post.html',
			controller: 'PostCtrl'
		});

		$stateProvider.state('user', {
			url:'/user/{id}',
			templateUrl: '/user.html',
			controller: 'UserCtrl'
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