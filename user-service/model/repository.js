import UserModel from "./user-model.js";
import "dotenv/config";
import mongoose from "mongoose";

export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await mongoose.connect(mongoDBUri);
}

export async function createUser(params) {
  return new UserModel(params).save();
}

export async function deleteUser(userId) {
  return UserModel.findByIdAndDelete(userId);
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email: email });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function updateUserById(userId, username, email, password) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username: username,
        email: email,
        password: password,
      },
    },
  );
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin: isAdmin,
      },
    },
  );
}

export async function findAllUsers() {
  return UserModel.find();
}
