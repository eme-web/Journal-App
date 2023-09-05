import LocalStrategy  from "passport-local";
import passport from "passport";
import mongoose from "mongoose";
import users from "../routes/users.js"
import bcrypt from "bcryptjs";
import User from "../models/User.js"


const localPassport = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'},
    async(email, password, done) => {
        // Match User
        const user = await User.findOne({email}).lean()

        if(!user) return done(null, false, {message: "No user Found"});

         // Match password
    bcrypt.compare(password, user.password, (err, isMatch) =>{
        if(err) throw err
        if(isMatch){
            return done(null, user);
        } else {
            return done(null, false, {message: "Password Incorrect"});
        }
    })
    
    }));

    passport.serializeUser(function(user, done) {
        process.nextTick(function() {
            return done(null, user._id)});
    });
    passport.deserializeUser(function(userid, done) {
        process.nextTick(function() {
            const user = User.findById(userid).lean()
            return done(null, user);
        });
            
    });
      
}

export default localPassport

