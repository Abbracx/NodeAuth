import { Document, Schema, model } from 'mongoose'

export interface User extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const schema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export const UserModel = model<User>('User', schema);