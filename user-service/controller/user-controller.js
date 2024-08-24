import {
  ormCreateUser as _createUser,
  ormDeleteUserById as _deleteUserById,
  ormFindAllUsers as _findAllUsers,
  ormFindUserById as _findUserById,
  ormUpdateUserById as _updateUserById,
  ormUpdateUserPrivilegeById as _updateUserPrivilegeById,
} from "../model/user-orm.js";

import bcrypt from "bcrypt";

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (username && email && password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

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
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when creating new user!" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    console.log(`DELETE USER: ID Obtained: ${userId}`);
    const response = await _deleteUserById(userId);
    if (response.err) {
      return res.status(400).json({ message: "Could not delete the user!" });
    } else if (!response) {
      console.log(`User with ${userId} not found!`);
      return res
        .status(404)
        .json({ message: `User with ${userId} not found!` });
    } else {
      console.log(`Deleted user ${userId} successfully!`);
      return res
        .status(200)
        .json({ message: `Deleted user ${userId} successfully!` });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Unknown error when deleting user!" });
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.id;
    console.log(`GET USER: ID Obtained: ${userId}`);
    const response = await _findUserById(userId);
    if (response === null) {
      console.log(`User with ${userId} not found!`);
      return res
        .status(404)
        .json({ message: `User with ${userId} not found!` });
    } else if (response.err) {
      return res.status(400).json({ message: "Could not find the user!" });
    } else {
      return res.status(200).json({
        message: `Found user with ${userId}!`,
        userDetails: response,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Unknown error when getting user!" });
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (username || email || password) {
      const userId = req.params.id;
      let hashedPassword;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      }
      console.log(`UPDATE USER: ID Obtained: ${userId}`);
      const response = await _updateUserById(userId, username, email, hashedPassword);
      if (response.err) {
        return res.status(409).json({
          message:
            "Could not update the user (Possibly duplicate Username or Email)!",
        });
      } else if (!response) {
        console.log(`User with id: ${userId} not found!`);
        return res
          .status(404)
          .json({ message: `User with id: ${userId} not found!` });
      } else {
        console.log(`User with id: ${userId} found!`);
        return res.status(200).json({
          message: `Updated User Data with id: ${userId}!`,
        });
      }
    } else {
      return res.status(400).json({
        message: "No field to update: Username and Email and Password are all missing!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "Unknown error when updating user!",
    });
  }
}

export async function updateUserPrivilege(req, res) {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {  // isAdmin can have boolean value true or false
      const userId = req.params.id;
      console.log(`UPDATE USER PRIVILEGE: ID Obtained: ${userId}`);
      const response = await _updateUserPrivilegeById(userId, isAdmin === true);
      if (response.err) {
        return res.status(400).json({
          message: "Could not update the user privilege!",
        });
      } else if (!response) {
        console.log(`User with ${userId} not found!`);
        return res
          .status(404)
          .json({ message: `User with ${userId} not found!` });
      } else {
        console.log(`User with ${userId} found!`);
        return res.status(200).json({
          message: `Updated User Privilege for user ${userId}!`,
        });
      }
    } else {
      return res.status(400).json({
        message: "isAdmin is missing!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Unknown error when updating user!",
    });
  }
}

export async function getAllUsers(req, res) {
  console.log(`GET ALL USERS`);

  const response = await _findAllUsers();

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
