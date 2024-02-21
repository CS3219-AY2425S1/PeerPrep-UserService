import UserModel from "./user-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDBUri =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.on("connected", () => console.log("MongoDB Connected!"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createUser(params) {
  params._id = new mongoose.Types.ObjectId();

  return new UserModel(params);
}

export async function deleteUser(email) {
  return UserModel.deleteOne({ email: email });
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email: email });
}

export async function updateUser(id, username, email, password) {
  return UserModel.updateOne(
    { _id: id },
    {
      $set: {
        username: username,
        email: email,
        password: password,
      },
    }
  );
}

export async function updateUserPrivilege(email, isAdmin) {
  return UserModel.updateOne(
    { email: email },
    {
      $set: {
        isAdmin: isAdmin,
      },
    }
  );
}

export async function findAllUsers() {
  return UserModel.find();
}
