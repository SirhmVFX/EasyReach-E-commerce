const { StatusCodes } = require("http-status-codes");
const HttpError = require("./HttpError");

class BadRequestError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;