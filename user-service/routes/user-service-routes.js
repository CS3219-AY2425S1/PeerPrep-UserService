import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
  updateUserPrivilege,
} from "../controller/user-controller.js";
import { verifyAccessToken, verifyEmail, verifyId, verifyIsAdmin } from "../middleware/basic-access-control.js";

const router = express.Router();

router.patch("/update-privilege", verifyAccessToken, verifyIsAdmin, updateUserPrivilege);

router.get("/all", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.get("/", verifyAccessToken, verifyEmail, getUserByEmail);

router.post("/", createUser);

router.patch("/", verifyAccessToken, verifyId, updateUser);

router.delete("/", verifyAccessToken, verifyEmail, deleteUser);

export default router;
