import express from "express";
import {
  createAff,
  createUser,
  deleteAff,
  deleteUser,
  getAllUsers,
  getUserAffData,
  getUserById,
  resetUserAffCount,
  updateUser,
  updateUserAction,
  updateUserAff,
} from "../controllers/userController.js";
import validateUser from "../middlewares/inputValidator.js";

const router = express.Router();

router.post("/user", validateUser, createUser);
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", validateUser, updateUser);
router.delete("/user/:id", deleteUser);
router.patch("/user/:id/affirmation/count/:affNum", updateUserAff);
router.get("/user/:id/affirmations", getUserAffData);
router.post("/user/:id/affirmation/list/:affirmation", createAff);
router.delete("/affirmation/:id", deleteAff);
router.patch("/user/:id/affirmation/reset", resetUserAffCount)
router.patch("/user/:id/affirmation/:affNum/action", updateUserAction)

export default router;
