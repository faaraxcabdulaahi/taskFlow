// import mongoose, { Schema, Document, Model } from "mongoose";
// import { User } from "@/types";

// export interface IUser extends Document, Omit<User, "id"> {
//   _id: mongoose.Types.ObjectId;
//   password: string;
// }

// const UserSchema = new Schema<IUser>({
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: [6, "Password must be at least 6 characters"],
//   },
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Transform _id to id and remove password
// UserSchema.set("toJSON", {
//   transform: (doc, ret) => {
//     ret.id = ret._id.toString();
//     delete ret._id;
//     delete ret.__v;
//     delete ret.password;
//     return ret;
//   },
// });

// const UserModel: Model<IUser> =
//   mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// export default UserModel;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 FIXED: If you have a pre-save hook, change 'next' to 'done'
// UserSchema.pre('save', function(this: IUser, done) {
//   // your code here
//   done();
// });

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;