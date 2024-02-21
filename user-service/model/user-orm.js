import { createUser, deleteUser, findUserByEmail } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, email, password) {
  try {
    const newUser = await createUser({ username, email, password });
    newUser.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormDeleteUser(email) {
  try {
    const result = await deleteUser(email);

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
    const result = await findUserByEmail(email);

    // Checking if User exists
    if (result) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not delete user");
    return { err };
  }
}
