import { Router } from "express";
import { IUser } from "../@types/user";
import { User } from "../database/model/user";
import { validateLogin, validateRegistration } from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { Logger, logger } from "../logs/logger";
import { validateToken } from "../middleware/validate-token";
import { error } from "winston";

const router = Router();

//get all users
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find();

    res.json(allUsers);
  } catch (e) {
    logger.error("Unauthorized: You must be an Admin user.", 401, error);
    next(e);
  }
});

//get user by id
router.get("/:id", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = (await User.findById(id).lean()) as IUser;

    const { password, ...rest } = user;
    return res.json({ user: rest });
  } catch (e) {
    next(e);
  }
});

//delete user
router.delete("/:id", isAdmin, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findOneAndDelete({ _id: id });
    Logger.verbose("deleted the user");
    return res.json(deleteUser);
  } catch (e) {
    next(e);
  }
});

//register
router.post("/", validateRegistration, async (req, res, next) => {
  try {
    const savedUser = await createUser(req.body as IUser);
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (err) {
    next(err);
  }
});

const fetchUserData = async (email: string) => {
  const userData = await User.findOne({ email }, { isAdmin: 1 });
  return userData;
};

//login
router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const jwt = await validateUser(email, password);
    const userData = await fetchUserData(email);

    const responsePayload = {
      ...jwt,
      ...userData,
    };
    res.json(responsePayload);
  } catch (error) {
    Logger.error("Login failed", 500, error);
    next(error);
  }
});

export { router as usersRouter };
