import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  full_name: string;
  email: string;
  password?: string;
  phone: string;
  role: string;
  commission: number;
  type_commission: "percentage" | "amount";
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    full_name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    password: { type: String, select: false },
    phone: { type: String },
    role: { type: String, trim: true, default: "seller" },
    commission: { type: Number, default: 0 },
    type_commission: {
      type: String,
      enum: ["percentage", "amount"],
      default: "percentage",
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Middleware para hash de password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Middleware para soft delete (lógico)
UserSchema.pre("updateOne", function (next) {
  const update: any = this.getUpdate();
  if (update.deleted === true && update.email) {
    update.email = `${update.email}_deleted_${Date.now()}`;
  }
  next();
});

export const UserModel = model<UserDocument>("User", UserSchema, "users");
