import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  country: { type: String, default: 'Jordan' },
  password: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
