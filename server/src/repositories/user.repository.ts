import { Types } from "mongoose";
import { IUser, User } from "../models/user.model";
import { BaseUserRepository } from "../abstractions/repositoryAbstractions/base.user.repository";

export class UserRepository extends BaseUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async create(data: { name: string; email: string; password: string }): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async updateById(id: string | Types.ObjectId, update: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, update, { new: true }).exec();
  }
  async findByIdWithoutPassword(id: string | Types.ObjectId): Promise<Omit<IUser, 'password'> | null> {
    return User.findById(id).select("-password").exec();
  }
}
