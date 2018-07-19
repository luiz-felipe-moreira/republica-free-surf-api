exports.verifyAdmin = function (req, res, next) {

    if (process.env.NODE_ENV === 'development') {
        next();
    } else if ((req.auth === undefined) || (!req.auth.admin)) {
        var err = new Error('You are not authorized to access this resource');
        err.status = 403;
        return next(err);
    }
};