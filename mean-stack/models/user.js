const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'users' });

const User = module.exports = mongoose.model('User', UserSchema);


// All the functions had to be modified a bit because the callback support was dropped
// in mongoose 7.x.x, I resolved this by making them async and some more modifications...
module.exports.getUserById = async function(id, callback) {
    const results = await User.findById(id).exec()
    .catch((e) => {throw e;});
    callback(null, results)
}
module.exports.getUserByUsername = async function(username, callback) {
    const query = {username: username};
    const results = await User.findOne(query).exec();
    callback(null, results);
}

module.exports.addUser = async function(newUser, callback){
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if(err){throw err};
        newUser.password = hash;
        await newUser.save();
    });
    });
};


module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};