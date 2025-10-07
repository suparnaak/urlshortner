import { Types } from "mongoose";
import { IUser } from "../../models/user.model";

export abstract class BaseUserRepository {
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findById(id: string | Types.ObjectId): Promise<IUser | null>;
  abstract create(data: { name: string; email: string; password: string }): Promise<IUser>;
  abstract updateById(id: string | Types.ObjectId, update: Partial<IUser>): Promise<IUser | null>;
  abstract findByIdWithoutPassword(id: string | Types.ObjectId): Promise<Omit<IUser, 'password'> | null>;
}
