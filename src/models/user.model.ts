import { IUser } from '@src/common/interface/user-interface';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true },
);

// FIX: Proper password hashing middleware
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next(); // ← FIX: Return here instead of else block
  }

  try {
    // Hash the password with salt rounds
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error: any) {
    next(error);
  }
});

// FIX: Enhanced comparePassword method with better error handling
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Add method to get user without password
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = model<IUser>('User', userSchema);

export default User;