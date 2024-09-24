import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    name: string;
    password: string | null; 
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String, 
        default: null, 
    },
});

export const UserModel = model<IUser>("User", UserSchema);
