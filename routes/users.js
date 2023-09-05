import express from "express";
import Idea from "../models/Idea.js";
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import passport from "passport";

const router = express.Router();

//User Login Route
router.get('/login', (req, res) =>{
    res.render('users/login');
});

//User Register Route
router.get('/register', (req, res) =>{
    res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) =>{
    passport.authenticate('local',{
        successRedirect: '/ideas', 
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Register Form POST
router.post('/register', async(req, res) =>{
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: 'Passwords do not match'});
    }

    if(req.body.password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'});
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        const { body: { email } }  = req

        const user = await User.findOne({email: email})
        if(user){
            req.flash('error_msg', 'Email already registered');
            res.redirect('/users/login');
        } else{
            const newUser = await new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            bcrypt.genSalt(10, (err, salt) =>{
                bcrypt.hash(newUser.password, salt, (err, hash) =>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save();
                    res.status(res, 201, newUser);
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/users/login');
                });
            });
        }

      
    }
});

// Logout User
router.get('/logout', function(req, res, next){
    req.logout(function(err){
        if(err){
            return next(err)
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    })    
});
    
    

export default router;
