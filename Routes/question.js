const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const Question = require('../Models/Question');
const User = require('../Models/User');

router = express.Router()

router.post('/getquestion', (req,res) => {
    Question.findOne({Num: req.body.CurQuestion},(err,obj) => {
        if (err) {
            res.send({Status: 0,Message: "Error - "+err})
        }
        else{
            if (obj===null){
                res.send({Status: 0,Message: "Invalid Request"})
            }

            else{
                res.send({Status: 1,Message: "Data fetched", Data: {
                    Text: obj.Text,
                    ImgUrl: obj.ImgUrl
                }})
            }
        }
    })
})

router.post('/check',(req,res) => {
    Question.findOne({Num: req.body.CurQuestion}, (err,obj) => {
        if (err) {
            res.send({Status: 0,Message: "Error - "+err})
        }

        else{
            if (obj===null){
                res.send({Status: 0,Message: "Invalid Request"})
            }

            else{
                if (obj.Ans.toLowerCase() == req.body.Ans.toLowerCase().trim()){
                    if (obj.SolvedBy<=5){
                        var base = 20
                    }
                    else {
                        var base = 15
                    }

                    if (req.body.useHint) {
                        var finalPoint = base - 5
                    }
                    else{
                        var finalPoint = base
                    }
                    User.findOneAndUpdate({_id: req.body.id},{CurQuestion: req.body.CurQuestion+1, Points: req.body.Points+ finalPoint},{new: true},(err,doc1) => {
                        Question.findOneAndUpdate({Num: req.body.CurQuestion},{SolvedBy: obj.SolvedBy +1 },() => {

                            res.send({Status: 1, Message: "Correct",Data: doc1})
                        })
                    })
                }
                else{
                    res.send({Status: 1, Message: "Wrong"})
                }
            }
        }
    })
})


router.post('/gethint', (req,res) => {
    Question.findOne({Num: req.body.CurQuestion}, (err,obj) => {
        if (err){
            res.send({Status: 0, Message: "Error - "+err})
        }
        else{
            User.findOne({_id: req.body.id}, (err,obj1) => {
                if (err) {
                    res.send({Status: 0, Message: "Error - "+err})
                }
                else{
                    var hintArr = obj1.UsedHints;
                    hintArr[req.body.CurQuestion - 1 ] = 1;
                    User.findOneAndUpdate({_id: req.body.id}, {UsedHints: hintArr}, () => {
                        res.send({Status: 1, Message: "Hint fetched", Hint: obj.Hint})
                    })
                }
            })
        }
    })
})

module.exports = router;