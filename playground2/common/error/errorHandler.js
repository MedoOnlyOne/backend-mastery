const logger = require("../logger/logger");

module.exports = (err, req, res, next) => {
    const isOperational = err.isOperational;
    logger.error({
        message: err.message,
        correlationId: req.correlationId,
        req: req.body
    });
    if(isOperational) {
        return res.status(err.statusCode).json({error: err.message});
    }
    return res.status(500).json({error: 'General API error'});
};