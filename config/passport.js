import LocalStrategy  from "passport-local";
import passport from "passport";
import mongoose from "mongoose";
import users from "../routes/users.js"
import bcrypt from "bcryptjs";
import User from "../models/User.js"


const localPassport = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, 
    async (email, password, done) => {
            //Match User
         User.findOne({email}).then(user => {
            if(!user) {
                return done(null, false, {message: "No user Found"});
            } 
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password Incorrect'});
                }
            })
         })
    })); 
    
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(async (userId, done) => {
        const user = await User.findById(userId) 
        return done(null, user);
    });
}
    
  


export default localPassport

