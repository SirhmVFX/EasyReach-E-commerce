const HttpError = require("../HttpException");

const authorizeUser = (currentUser, currentUserId) => {
  if (currentUser.userId === currentUserId.toString()) return;
 
  throw new HttpError.UnauthorizedHttpError(
    "You are not authorized to access these resource"
  );
};

module.exports = authorizeUser;