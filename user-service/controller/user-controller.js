import { ormCreateUser as _createUser } from "../model/user-orm.js";
import { ormDeleteUser as _deleteUser } from "../model/user-orm.js";
import { ormFindUserByEmail as _findUserByEmail } from "../model/user-orm.js";
import { ormUpdateUser as _updateUser } from "../model/user-orm.js";
import { ormUpdateUserPrivilege as _updateUserPrivilege } from "../model/user-orm.js";
import { ormFindAllUsers as _findAllUsers } from "../model/user-orm.js";

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
        return res.status(409).json({
          message:
            "Could not create a new user! (Possibly Username or Email Already Exists!)",
        });
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
      const response = await _findUserByEmail(email);
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

export async function updateUser(req, res) {
  try {
    const { id, username, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (id && username && email && hashedPassword) {
      console.log(`UPDATE USER: ID Obtained: ${id}`);
      const response = await _updateUser(id, username, email, hashedPassword);
      console.log(response);
      if (response.err) {
        return res.status(409).json({
          message:
            "Could not update the user (Possibly duplicate Username or Email)!",
        });
      } else if (!response) {
        console.log(`User with id: ${id} not found!`);
        return res
          .status(404)
          .json({ message: `User with id: ${id} not found!` });
      } else {
        console.log(`User with id: ${id} found!`);
        return res.status(200).json({
          message: `Updated User Data with id: ${id}!`,
        });
      }
    } else {
      return res.status(400).json({
        message: "id and/or Username and/or Email and/or Password are missing!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "Database failure when updating user! (Possibly Missing Password field)",
    });
  }
}

export async function updateUserPrivilege(req, res) {
  try {
    const { email, isAdmin } = req.body;

    if (email && isAdmin) {
      console.log(`UPDATE USER PRIVILEGE: Email Obtained: ${email}`);
      const response = await _updateUserPrivilege(email, isAdmin);
      console.log(response);
      if (response.err) {
        return res.status(400).json({
          message: "Could not update the user privilege!",
        });
      } else if (!response) {
        console.log(`User with email: ${email} not found!`);
        return res
          .status(404)
          .json({ message: `User with email: ${email} not found!` });
      } else {
        console.log(`User with email: ${email} found!`);
        return res.status(200).json({
          message: `Updated User Privilege with email: ${email}!`,
        });
      }
    } else {
      return res.status(400).json({
        message: " Email and/or isAdmin are missing!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Database failure when updating user!",
    });
  }
}

export async function getAllUsers(req, res) {
  console.log(`GET ALL USERS`);

  const response = await _findAllUsers();

  console.log(response);

  if (response === null) {
    return res.status(404).json({ message: `No users exist!` });
  } else if (response.err) {
    return res.status(400).json({ message: "Could not find users!" });
  } else {
    console.log(`Users found!`);
    return res.status(200).json({
      message: `Found users!`,
      users: response,
    });
  }
}
