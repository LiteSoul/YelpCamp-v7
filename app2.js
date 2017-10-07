const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds')
seedDB()
const passport = require('passport'),
	LocalStrategy = require('passport-local'),
	session = require('express-session'),
	campgroundRoutes = require('./routes/campgrounds'),
	commentsRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index')

mongoose.connect('mongodb://yelpv6:yelpv6@ds151963.mlab.com:51963/yelp-v6', {
	useMongoClient: !0
})

app.set('view engine', 'ejs')
app.use(
	bodyParser.urlencoded({
		extended: !0
	})
)
app.use(express.static(__dirname + '/public'))
app.use(
	session({
		secret: 'pasaporte falso',
		resave: !1,
		saveUninitialized: !1
	})
)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((a, b, c) => {
	;(b.locals.currentUser = a.user), c()
})
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentsRoutes)
app.use('/', indexRoutes)
app.get('*', (a, b) => {
	b.send('404 NOTHING TO SEE HERE...')
})
let port = process.env.PORT || 3e3
app.listen(port, function() {
	console.log(`Our app is running on http://localhost:${port}`)
})
