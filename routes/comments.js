const express = require('express')
//Preserve the req.params values from the parent router.
//In this case campgrounds so we can access :id
const router = express.Router({ mergeParams: true })
//models require
const Campground = require('../models/campground')
const Comment = require('../models/comment')

//Comments new
router.get('/new', isLoggedIn, (req, res) => {
	//see SHOW campground route for method
	Campground.findById(req.params.id, function(err, foundCamp) {
		if (err) {
			console.log(err)
		} else {
			res.render('comments/new', { campground: foundCamp })
		}
	})
})

//Comments create
router.post('/', isLoggedIn, function(req, res) {
	//Create a new comment and save it to DB:
	Campground.findById(req.params.id, function(err, foundCamp) {
		if (err) {
			console.log(err)
			res.redirect('/campgrounds')
		} else {
			// get data from form and add to campground comments
			//but instead of these 3 sentences:
			//var author = req.body.comment.author
			//var text = req.body.comment.text
			//var newComment = {author, text}
			//we just use comment[array] sent from new.ejs
			Comment.create(req.body.comment, function(err, new_comm) {
				if (err) {
					console.log(err)
				} else {
					foundCamp.comments.push(new_comm)
					foundCamp.save()
					// redirect back to campground, default is GET campground:
					res.redirect('/campgrounds/' + foundCamp._id)
				}
			})
		}
	})
})

//checks if is logged in before doing the next step
//this functions as a middleware, use it after a route, before the callback
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

module.exports = router
