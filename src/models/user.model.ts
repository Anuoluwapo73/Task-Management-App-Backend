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

userSchema.pre('save', async function (next) {
  // Hash password before saving (pseudo-code)
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
const User = model<IUser>('User', userSchema);

export default User;
