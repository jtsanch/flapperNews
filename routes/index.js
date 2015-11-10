var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Post  = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.param('post', function(req, res, next, id){
	var query = Post.findById(id);
	query.exec(function(err, post){
		if(err)   { return next(err); }
		if(!post) { return next(new Error("Didn't find post")); }
		req.post = post;
		return next();
	});
});

router.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if(err) { return next(err); }
		if(!comment) { return next( new Error("Didn't find comment")); }
		req.comment = comment;
		return next();
	});
});

router.put('/post/:post/upvote', function(err, next){
	req.post.upvote(function(err, next){
		if(err) { return next(err); }

		res.json(post);
	});
});

router.post('/post/:post/comments', function(req, res, next){
	var comment  = new Comment(req.body);
	comment.post = req.post;
	comment.save(function(err, comment){
		if(err) { return next(err); }
		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if(err) { return next(err); }
			res.json(comment);
		});
	});
});

router.put('/post/:post/:comment/upvote', function(err, next){
	req.comment.upvote(function(err, next){
		if(err) { return next(err); }

		res.json(comment);
	});
});

router.get('/post/:post', function(req, res){
	req.post.populate('comments', function(err, post){
		if(err) { return next(err); }
		res.json(post);
	});
});

router.get('/post/:post/comments', function( req, res, next){
	query.exec(function( err, comment){
		if(err) { return next(err);}
		if(!comment) { return next(new Error('No comment'));}

		req.comment = comment;
		return next();
	})
});

router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		res.json(posts);
	});
});

router.post('/posts', function(req, res, next){
	var post = new Post(req.body);

	post.save(function(err, post){
		if(err){ return next(err); }
		res.json(post);
	});

});

router.get('/posts/:post', function(req, res){
	res.json(req.post);
});

router.put('/posts/:post/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if(err) { return next(err);}
		res.json(post);
	});
});

router.post('/posts/:post/comments', function(req, res, next){
	var comment = new Comment(req.body);
	comment.post = req.post;
	req.post.comments.push(comment);

	comment.save(function(err, comment){
		if(err) {return next(err);}
		res.json(comment);
	})
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
