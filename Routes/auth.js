const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
var Recaptcha = require('recaptcha-verify');

var recaptcha = new Recaptcha({
    secret: process.env.CAPTCHA_SECRET_KEY,
    verbose: true
});

router = express.Router()

router.post('/signup', (req,res) => {

    recaptcha.checkResponse(req.body.CaptchaToken, function(error, response){
        if(error){
            // an internal error?
            res.status(400).render('400', {
                message: error.toString()
            });
            return;
        }
        if(response.success){

            bcrypt.hash(req.body.Password,null,null,(err,hash) => {
                User.create({
                    TeamName: req.body.TeamName,
                    Email : req.body.Email,
                    Password : hash,
                    CurQuestion: 1,
                    Points: 0,
                    UsedHints: [0,0,0,0,0,0,0,0,0,0]
                })
                .then(data => {
                    res.send({Status: 1, Message: "User created."})
                })
                .catch(err => {
                    res.send({Status: 0, Message: "Failed Sign up - "+err})
                })
            })



        }else{
            res.send({Status: 0, Message: "Failed to verify captcha"})
        }
    });
})

router.post('/login',(req,res) => {

    if (req.body.auto){
        try{
            const decoded = jwt.verify(req.cookies.enigma.token, process.env.JWT_KEY);
            var LoginEmail = decoded.email;
            var LoginPassword = decoded.pass;
            console.log(decoded)
        }
    
        catch(err){
            res.status(401).json({
                Message: "Forbidden"
            })
        }
    }

    else{
        var LoginEmail = req.body.Email;
        var LoginPassword = req.body.Password;
    }


    User.findOne({Email: LoginEmail},(err,obj) => {
        if (err) {
            res.send({Status: 0, Message: "Failed due to " + err})
        }
        else{
            if (obj === null) {
                res.send({Status: 0, Message: "Username/Password is invalid!"})
            }
            else {
                bcrypt.compare(LoginPassword,obj.Password,(err,result) => {
                    if (err) {
                        res.send({Status: 0, Message: "Error in server "+err})
                    }
                    else {
                        if (result){
                            const token = jwt.sign({
                                email: obj.Email,
                                pass : LoginPassword,
                                id: obj._id
                            },process.env.JWT_KEY,{expiresIn:'1h'})

                            res.cookie('enigma',{
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

router.get('/logout',(req,res) => {
    res.clearCookie('enigma');
    res.json({
        Message: "Logged out."
    })
})

module.exports = router;