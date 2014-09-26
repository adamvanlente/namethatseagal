// ******************************************
// Schema for Game score
// __________________________________________

var mongoose = require('mongoose');

var GameScore = function() {

    var _schemaModel = mongoose.Schema({

        user            : String,
        username        : String,
        mode            : String,
        number_correct  : String,
        date            : String

    });

    var _model = mongoose.model('GameScore', _schemaModel);

    // Create a new entry for a game score.
    var _createNew = function(scoreObject, callback) {
        _model.create(scoreObject, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    };

    // Find scores for an individual user.
    var _findUserScores = function(id, start, callback) {
        console.log(start);
        _model.find({ 'user' : id}, {__v: 0}, {sort: {date: -1}, skip: start, limit: 20},
            function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Get all of the scores.
    var _findAll = function(type, start, callback) {

        /**
          * A comment about this function:
          * This was a good learning experience for me, as my 2nd true app with
          * mongo/mongoose.  I stored the scores as strings, which of course was
          * an issue when I wanted to sort by the scores - it sorted them lexically
          * as strings (eg 0, 1, 10, 12, 2, 23, 3, 45).  This was an even bigger
          * proglem because - if I wanted to maintain pagination on the server side -
          * the problem had to be solved server side too.  The result is that this
          * code is ugly, and I didn't want to update it because there was existing
          * data in the database.  So, below we pull all the results, sort them all,
          * then return to the client the paginated results they requested.  If this
          * were a scaled app with many users, moving that sorting away from the
          * datbase would have been costly.
          */

        _model.find({ 'mode' : type}, {__v: 0}, {sort: {number_correct: -1}},
            function(err, doc) {
            if(err) {
                fail(err);
            } else {

                var holder = [];

                // Dump all the (non-paginated) scores into a holder.
                for (var i = 0; i < doc.length; i++) {
                    var item = doc[i];

                    // Make sure the score is an int, not a string.
                    item.number_correct = parseFloat(item.number_correct);
                    holder.push(item);
                }

                // Sort the scores.
                holder.sort(function(a,b) {
                    // assuming distance is always a valid integer
                    return parseInt(b.number_correct,10) - parseInt(a.number_correct,10);
                });

                // Create a response containing ten paginated scores.
                var newHolder = [];

                for (var i = start; i < start + 10; i++) {
                    if (holder[i]) {
                        newHolder.push(holder[i]);
                    }
                }

                callback(newHolder);
            }
        });
    }

    return {
        createNew: _createNew,
        findUserScores: _findUserScores,
        findAll: _findAll,
        model: _model
    }
}();

module.exports = GameScore;
