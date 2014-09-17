// ******************************************
// Schema for User accounts
// __________________________________________

var mongoose = require('mongoose');

var User = function() {

    var _schemaModel = mongoose.Schema({

        local            : {
            email        : String,
            password     : String,
            name         : String
        }
    });

    var _model = mongoose.model('User', _schemaModel);

    // Create a new User account.
    var _createNew = function(userObject, callback) {
        _model.create(userObject, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    };

    // Find a user account by _id.
    var _findById = function(id, callback) {
        _model.findOne({ '_id' : id}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }


    // Find a user by email address.
    var _findByEmail = function(email, callback) {
        _model.findOne({ 'local.email' : email}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Return all user accounts.
    var _findAll = function(callback) {
        _model.find({}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    return {
        createNew: _createNew,
        findByEmail: _findByEmail,
        findById: _findById,
        findAll: _findAll,
        model: _model
    }
}();

module.exports = User;
