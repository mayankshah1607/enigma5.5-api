const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    TeamName: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: String,
    CurQuestion: Number,
    Points: Number,
    UsedHints: Array
})

const User = mongoose.model('user',UserSchema);
module.exports = User;