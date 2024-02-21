import {
  ormCreateUser as _createUser,
  ormFindUserByEmail,
} from "../model/user-orm.js";
import { ormDeleteUser as _deleteUser } from "../model/user-orm.js";
import { ormFindUserByEmail as _findUserByEmail } from "../model/user-orm.js";

import bcrypt from "bcrypt";

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (username && email && hashedPassword) {
      console.log(`CREATE USER: Email Obtained: ${email}`);
      const resp = await _createUser(username, email, hashedPassword);
      console.log(resp);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: "Could not create a new user!" });
      } else {
        console.log(`Created new user ${username} successfully!`);
        return res
          .status(201)
          .json({ message: `Created new user ${username} successfully!` });
      }
    } else {
      return res.status(400).json({
        message: "Username and/or Email and/or Password are missing!",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { email } = req.body;
    if (email) {
      console.log(`DELETE USER: Email Obtained: ${email}`);
      const response = await _deleteUser(email);
      console.log(response);
      if (response.err) {
        return res.status(400).json({ message: "Could not delete the user!" });
      } else if (!response) {
        console.log(`User with ${email} not found!`);
        return res
          .status(404)
          .json({ message: `User with ${email} not found!` });
      } else {
        console.log(`Deleted user ${email} successfully!`);
        return res
          .status(200)
          .json({ message: `Deleted user ${email} successfully!` });
      }
    } else {
      return res.status(400).json({
        message: "Email is missing!",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when deleting user!" });
  }
}

export async function getUserByEmail(req, res) {
  try {
    const { email } = req.body;
    if (email) {
      console.log(`GET USER: Email Obtained: ${email}`);
      const response = await ormFindUserByEmail(email);
      console.log(response);
      if (response === null) {
        console.log(`User with ${email} not found!`);
        return res
          .status(404)
          .json({ message: `User with ${email} not found!` });
      } else if (response.err) {
        return res.status(400).json({ message: "Could not find the user!" });
      } else {
        console.log(`User with ${email} found!`);
        return res.status(200).json({
          message: `Found user with ${email}!`,
          userDetails: response,
        });
      }
    } else {
      return res.status(400).json({
        message: "Email is missing!",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when getting user!" });
  }
}
