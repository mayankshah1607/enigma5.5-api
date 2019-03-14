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
    Points: Number
})

const User = mongoose.model('full',UserSchema);
module.exports = User;