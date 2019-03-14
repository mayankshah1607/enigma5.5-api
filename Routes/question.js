const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const Question = require('../Models/Question');

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

module.exports = router;