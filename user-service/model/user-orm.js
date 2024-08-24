import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUserById,
  updateUserPrivilegeById,
} from "./repository.js";

export async function ormCreateUser(username, email, password) {
  try {
    await createUser({ username, email, password });
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormDeleteUserById(userId) {
  try {
    const result = await deleteUser(userId);

    // Checking if User existed
    if (result.deletedCount === 0) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("ERROR: Could not delete user");
    return { err };
  }
}

export async function ormFindUserByEmail(email) {
  try {
    return await findUserByEmail(email);
  } catch (err) {
    console.log("ERROR: Could not find user");
    return { err };
  }
}

export async function ormFindUserById(userId) {
  try {
    return await findUserById(userId);
  } catch (err) {
    console.log("ERROR: Could not find user");
    return { err };
  }
}

export async function ormUpdateUserById(id, username, email, password) {
  try {
    const result = await updateUserById(id, username, email, password);

    // Checking if User Details Modified
    if (result.modifiedCount === 0) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("ERROR: Could not update user data");
    return { err };
  }
}

export async function ormUpdateUserPrivilegeById(userId, isAdmin) {
  try {
    const result = await updateUserPrivilegeById(userId, isAdmin);

    // Checking if User Details Modified
    if (result.modifiedCount === 0) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("ERROR: Could not update user privilege");
    return { err };
  }
}

export async function ormFindAllUsers() {
  try {
    const result = await findAllUsers();

    // Checking if Users exist
    if (result.length !== 0) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not find users");
    return { err };
  }
}
