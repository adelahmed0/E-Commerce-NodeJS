import { errorResponse } from "../helpers/response.js";
import { ROLES } from "../enums/roles.js";

const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.auth) {
        return errorResponse(
          res,
          401,
          "Unauthorized - Please login to access this resource",
        );
      }
      const userRole = req.auth.role;
      if (!allowedRoles.includes(userRole)) {
        return errorResponse(
          res,
          403,
          "Forbidden - You do not have permission to perform this action",
        );
      }
      next();
    } catch (error) {
      return errorResponse(
        res,
        500,
        "Internal Server Error - Role authorization failed",
        error.message,
      );
    }
  };
};

const adminAuth = roleAuth([ROLES.ADMIN]);
const userAuth = roleAuth([ROLES.USER]);
const adminAndUserAuth = roleAuth([ROLES.ADMIN, ROLES.USER]);

export { adminAuth, userAuth, adminAndUserAuth };
