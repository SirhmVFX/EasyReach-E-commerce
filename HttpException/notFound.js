const { StatusCodes } = require("http-status-codes");
const HttpError = require("./HttpError");

class NotFoundError extends HttpError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;