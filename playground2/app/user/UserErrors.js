const AppError = require("../../common/error/AppError");

const UserAlreadyExists = new AppError('User already exists', 400, true);
const InvalidCredentials = new AppError('Invalid credentials', 400, true);``
const InvalidToken = new AppError('Invalid token', 400, true);``

module.exports = {
    UserAlreadyExists,
    InvalidCredentials,
    InvalidToken
}