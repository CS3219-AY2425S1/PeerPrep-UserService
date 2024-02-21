import express from "express";

import { createUser } from "../controller/user-controller.js";
import { deleteUser } from "../controller/user-controller.js";
import { getUserByEmail } from "../controller/user-controller.js";
import { updateUser } from "../controller/user-controller.js";
import { updateUserPrivilege } from "../controller/user-controller.js";
import { getAllUsers } from "../controller/user-controller.js";

const router = express.Router();

router.patch("/update-privilege", updateUserPrivilege);

router.get("/all", getAllUsers);

router.get("/", getUserByEmail);

router.post("/", createUser);

router.patch("/", updateUser);

router.delete("/", deleteUser);

export default router;
