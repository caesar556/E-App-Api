import { Document, model, Schema } from 'mongoose';
import bcrypt from "bcryptjs";


const Roles = ['user', 'admin', 'seller'];

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      minLength: [2, "must be at least 2 charcter"],
      maxLength: [15, "Too long first name"]
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      minLength: [2, "must be at least 2 charcter"],
      maxLength: [15, "Too long last name"]
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Invaild email format"
      }
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
      minLength: [8, "must be at least 8 charcter"],
      maxLength: [15, "Too long password"]
    },
    /*passwordConfirm: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password confirmation does not match password"
      },
      minLength: [8, "must be at least 8 charcter"],
      required: [true, "passwordConfirm is required"],
      maxLength: [15, "Too long password"]

    },*/
    profileImage : {
      type : String,
      default: '../uploads/defaults/profile-image.jpg'
    },
    refreshToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    role: {
      type: String,
      enum: Roles,
      default: "user"
    },
    passwordChangeAt: {
      type: Date
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

export const User = model("User", userSchema);