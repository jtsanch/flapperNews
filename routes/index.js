var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'DEV-SECRET', userProperty: 'payload'});

var Post     = mongoose.model('Post');
var Comment  = mongoose.model('Comment');
var User     = mongoose.model('User');

router.post('/login', function(req, res, next) [ 
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Fill out all the fields'});
	}
	passport.authenticate('local', function(err, user, info){
		if(err){ return next(err); }
		if(user) { 
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		})(req, res, next);
	});
}

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

//----------------------------------------
//Post Routes
//----------------------------------------
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

//--------------------------------------
//User Routes
//--------------------------------------
router.get('/users/login', function(req, res, next){
	var user = new User(req.body);

	user.save(function(err, user){
		if(err) { return next(err); }
		//create session cookie here I guess
		res.json(user);
	});
});

router.post('/users/create', funciton(req, res, next){

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
