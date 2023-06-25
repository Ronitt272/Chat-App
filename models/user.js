//user database
let mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: {type: String, unique: true, required: true}, 
    password: String
});

module.exports = new mongoose.model('user', userSchema);