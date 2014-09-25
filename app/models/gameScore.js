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
        _model.find({ 'mode' : type}, {__v: 0}, {sort: {number_correct: -1}},
            function(err, doc) {
            if(err) {
                fail(err);
            } else {

                var holder = [];

                for (var i = 0; i < doc.length; i++) {
                    var item = doc[i];
                    item.number_correct = parseFloat(item.number_correct);
                    holder.push(item);
                }

                holder.sort(function(a,b) {
                    // assuming distance is always a valid integer
                    return parseInt(b.number_correct,10) - parseInt(a.number_correct,10);
                });

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
