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

module.exports = router;