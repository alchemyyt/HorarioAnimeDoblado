import { Schema, model, models } from "mongoose";
const UserSchemema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const User = models.User || model("User", UserSchemema);
export default User;
