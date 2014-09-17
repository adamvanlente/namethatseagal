// ******************************************
// Main route handler.
// __________________________________________

var User       		   = require('../models/user');
var GameScore  		   = require('../models/gameScore');

// Get the authorization variables.
var configAuth       = require('../../config/auth');

// Export main routes to app.
module.exports = function(app, passport) {


 // ====================================
 // ====================================
 // HOME PAGE ROUTE ====================
 // ====================================
 // ====================================
  app.get('/', function(req, res) {
      res.render('index.jade', { user : req.user });
	});

  // ====================================
  // ====================================
  // LOG A GAME SCORE ===================
  // ====================================
  // ====================================
   app.post('/logScore/:id/:mode/:correct/:username', function(req, res) {

        var user              = req.params.id;
        var username          = req.params.username;
        var mode              = req.params.mode;
        var correct           = req.params.correct;

        var newScore            = {};
        newScore.user           = user;
        newScore.username       = username;
        newScore.mode           = mode;
        newScore.number_correct = String(correct);
        newScore.date           = new Date();

        GameScore.createNew(newScore, function(doc) {
            res.json(doc);
        });



   });


   // ====================================
   // ====================================
   // GET A USER'S SCORES ================
   // ====================================
   // ====================================
    app.post('/myScores/:id/:start', function(req, res) {

         var user              = req.params.id;
         var start             = req.params.start;

         GameScore.findUserScores(user, start, function(doc) {
             res.json(doc);
         });
    });

    // ====================================
    // ====================================
    // GET ALL SCORES
    // ====================================
    // ====================================
     app.post('/allScores', function(req, res) {

          GameScore.findAll(function(doc) {
              res.json(doc);
          });
     });


};
