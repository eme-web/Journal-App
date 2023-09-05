export const validateUsers = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('erorr_msg', 'Not Authorized');
    res.redirect('/users/login');
}

