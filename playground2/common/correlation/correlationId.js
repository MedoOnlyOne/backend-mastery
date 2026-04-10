const {v4: uuidv4} = require('uuid');

module.exports = (req, res, next) => {
    const uuid = uuidv4().split('-').join("");
    const correlationId = `Medo3M${uuid}`;
    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
}