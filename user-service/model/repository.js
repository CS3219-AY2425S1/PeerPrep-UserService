import UserModel from "./user-model.js";
import "dotenv/config";

// Set up mongoose connection
import mongoose from "mongoose";

let mongoDBUri =
  process.env.ENV === "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDBUri);

let db = mongoose.connection;
db.on("connected", () => console.log("MongoDB Connected!"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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
