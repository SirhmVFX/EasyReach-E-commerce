const BadRequestError = require("./badRequest");
const UnauthorizedError = require("./unauthorized");
const UnauthenticatedError = require("./Unauthenticated");
const HttpError = require("./HttpError");
const NotFoundError = require("./notFound");

module.exports = {
  BadRequestError,
  HttpError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
};