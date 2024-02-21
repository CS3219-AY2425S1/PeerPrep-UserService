import express from "express";

import { createUser } from "../controller/user-controller.js";
import { deleteUser } from "../controller/user-controller.js";

const router = express.Router();

// router.get("/", getAllUsers);

// router.patch("/update-privilege", updateUserPrivilege);

// router.get("/:userId", getUserById);

router.post("/", createUser);

// router.patch("/:userId", updateUserData);

router.delete("/", deleteUser);

export default router;
