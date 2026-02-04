import * as authService from "../services/auth.service.js";
import { successResponse, errorResponse } from "../helpers/response.js";

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, 201, req.t("auth.userCreated"), user.toJSON());
  } catch (error) {
    const statusCode = error.message === "auth.userExists" ? 409 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("auth.") ? error.message : "auth.createFailed",
      ),
      error.message,
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    return successResponse(res, 200, req.t("auth.loginSuccess"), {
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    const statusCode = error.message === "auth.invalidCredentials" ? 401 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("auth.") ? error.message : "auth.loginFailed",
      ),
      error.message,
    );
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.auth.id);
    return successResponse(
      res,
      200,
      req.t("auth.profileFetched"),
      user.toJSON(),
    );
  } catch (error) {
    const statusCode = error.message === "auth.userNotFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("auth.")
          ? error.message
          : "auth.profileFetchFailed",
      ),
      error.message,
    );
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await authService.updateUserProfile(req.auth.id, req.body);
    return successResponse(
      res,
      200,
      req.t("auth.profileUpdated"),
      user.toJSON(),
    );
  } catch (error) {
    let statusCode = 500;
    if (error.message === "auth.emailExists") statusCode = 409;
    if (error.message === "auth.userNotFound") statusCode = 404;

    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("auth.")
          ? error.message
          : "auth.profileUpdateFailed",
      ),
      error.message,
    );
  }
};
