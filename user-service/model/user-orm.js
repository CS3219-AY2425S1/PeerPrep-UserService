import { createUser, deleteUser } from "./repository.js";

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
