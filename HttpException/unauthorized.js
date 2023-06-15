const { StatusCodes } = require('http-status-codes');
const HttpError = require("./HttpError");

class UnauthorizedError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;