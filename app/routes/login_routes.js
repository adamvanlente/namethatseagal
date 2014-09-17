// ******************************************
// Route handler for logins.
// __________________________________________

module.exports = function(app, passport) {

	// ====================================
  // ====================================
  // APP LOGIN ==========================
  // ====================================
  // ====================================
	app.get('/login', function(req, res) {
			var msg = {
				mode: 'login',
			};

			res.render('login.jade', { msg: msg });
	});

	app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/',
			failureRedirect : '/login/incorrect'
	}));

	app.get('/login/incorrect', function(req, res) {
			var msg = {
				mode: 'login',
				msg: 'incorrect user/pass combination.  try again.'
			};

			res.render('login.jade', { msg: msg });
	});

  // ====================================
  // ====================================
  // SIGNUP =============================
  // ====================================
  // ====================================
	app.get('/signup', function(req, res) {
			var msg = {
				mode: 'signup',
			};

			res.render('login.jade', { msg: msg });
	});

  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/',
      failureRedirect : '/signup/existing'
  }));

	app.get('/signup/existing', function(req, res) {
			var msg = {
				mode: 'signup',
				msg: 'that email is in our system. login, or sign up with a different address.'
			};

			res.render('login.jade', { msg: msg });
	});

  // ====================================
  // ====================================
  // LOGOUT =============================
  // ====================================
  // ====================================
	app.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
	});

};

// Confirm that a user is logged in.
function isLoggedIn(req, res, next) {

  	// Move along if all is well.
  	if (req.isAuthenticated())
  		return next();

  	// Kick back to home page if no user is detected.
  	res.redirect('/');
}
