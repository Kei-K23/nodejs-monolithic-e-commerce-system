import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  role: USER_ROLE;
}

interface UserDocs extends IUser, mongoose.Document {
  verifyPassword(plainPassword: string): Promise<boolean>;
}

interface UserModelInterface extends mongoose.Model<UserDocs> {
  build(attr: IUser): UserDocs;
}

const userSchema = new mongoose.Schema<UserDocs>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Name too short'],
      maxlength: [100, 'Name too long'],
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [3, 'Username too short'],
      maxlength: [100, 'Username too long'],
      validate: {
        // Check username is already taken or not
        validator: async function (v: string): Promise<boolean> {
          const doc = await User.findOne({ username: v });
          if (doc) return doc.id === this.id;
          else return Boolean(!doc);
        },
        message: 'Username is already taken',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, 'Password too short'],
      maxlength: [20, 'Password too long'],
    },
    role: {
      type: String,
      required: true,
      enum: [USER_ROLE.ADMIN, USER_ROLE.USER],
      default: USER_ROLE.USER,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [8, 'Email too short'],
      maxlength: [255, 'Email too long'],
      validate: {
        // Check username is already taken or not
        validator: async function (v: string): Promise<boolean> {
          const doc = await User.findOne({ email: v });
          if (doc) return doc.id === this.id;
          else return Boolean(!doc);
        },
        message: 'Email is already taken',
      },
    },
  },
  // createdAt and updatedAt timestamps
  {
    timestamps: true,
    toJSON: {
      transform(_doc, returnedObj) {
        // Make sure not to export password and change default _id to id
        returnedObj.id = returnedObj._id;
        delete returnedObj._id;
        delete returnedObj.password;
        delete returnedObj.__v;

        return returnedObj;
      },
    },
  },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // If password is not modified, then return
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Password verify method, our own instance method of mongoose Document
userSchema.methods.verifyPassword = async function (
  plainPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

userSchema.set('toJSON', {
  transform(_doc, returnedObj) {
    // Make sure not to export password and change default _id to id
    returnedObj.id = returnedObj._id;
    delete returnedObj._id;
    delete returnedObj.password;
    delete returnedObj.__v;

    return returnedObj;
  },
});

export const User = mongoose.model<UserDocs, UserModelInterface>(
  'User',
  userSchema,
);
