const { StatusCodes } = require("http-status-codes");
const HttpError = require("./HttpError");

class UnauthenticatedError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;