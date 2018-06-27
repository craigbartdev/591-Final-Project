const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    access_token: String,
    refresh_token: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;