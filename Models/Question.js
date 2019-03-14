const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    Num: Number,
    Text: String,
    ImgUrl : String,
    Ans: String,
    Hint: String
})

const Question = mongoose.model('full',QuestionSchema)
module.exports = Question;