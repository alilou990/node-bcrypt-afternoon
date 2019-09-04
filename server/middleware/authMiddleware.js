const usersOnly = (req, res, next) => {
    if(!req.session.user) {
        res.status(401).send('Please log in');
    } 
    next();
};

const adminsOnly = (req, res, next) => {
    if(req.session.user.isAdmin){
        return res.status(403).send('You are not an admin!')
    }
    next()
}

module.exports = {
    usersOnly,
    adminsOnly
}