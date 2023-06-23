const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, 
    // Limit each IP to 5 only login requests per minute
    max: 5, 
    message:
        { message: 'Too many login attempts from this IP, please try again after 1 minute' },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, 
    legacyHeaders: false, 
})

module.exports = loginLimiter