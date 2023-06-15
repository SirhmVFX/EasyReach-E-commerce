const { isTokenValid } = require("../utils");
const HttpError = require("../HttpException");
const authenticateUser = async (req, res, next) => {
    const AuthorizationHeader = req.headers.authorization;

    if (!AuthorizationHeader || !AuthorizationHeader.startsWith("Bearer")) {
        throw new HttpError.UnauthenticatedError("Invalid authentication xx");
    }
    const token = AuthorizationHeader.split(" ")[1];
    try {
        const { username, firstname, userId, role } = isTokenValid({ token });
        req.user = { username, firstname, userId, role };
        next();
    } catch (error) {
        throw new HttpError.UnauthenticatedError("Invalid authentication x");
    }
};
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new HttpError.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
    };
};

module.exports = { authenticateUser, authorizePermissions };