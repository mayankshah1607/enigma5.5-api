const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

router = express.Router()

router.post('/signup', (req,res) => {
    bcrypt.hash(req.body.Password,null,null,(err,hash) => {
        User.create({
            TeamName: req.body.TeamName,
            Email : req.body.Email,
            Password : hash,
            CurQuestion: 1,
            Points: 0
        })
        .then(data => {
            res.send({Status: 1, Message: "User created."})
        })
        .catch(err => {
            res.send({Status: 0, Message: "Failed Sign up - "+err})
        })
    })
})

router.post('/login',(req,res) => {
    User.findOne({Email: req.body.Email},(err,obj) => {
        if (err) {
            res.send({Status: 0, Message: "Failed due to " + err})
        }
        else{
            if (obj === null) {
                res.send({Status: 0, Message: "Username/Password is invalid!"})
            }
            else {
                bcrypt.compare(req.body.Password,obj.Password,(err,result) => {
                    if (err) {
                        res.send({Status: 0, Message: "Error in server "+err})
                    }
                    else {
                        if (result){
                            const token = jwt.sign({
                                email: obj.email,
                                id: obj._id
                            },process.env.JWT_KEY,{expiresIn:'1h'})

                            res.cookie('enigma_user',{
                                email: obj.Email,
                                id: obj._id,
                                token: token
                            })
                            res.send({Status: 1, Message: "User Authenticated", Data: obj})
                        }

                        else{
                            res.send({Status: 0, Message: "Username/Password is invalid!"})
                        }
                    }
                })
            }
        }
    })

})

module.exports = router;