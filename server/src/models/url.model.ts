import mongoose, { Schema, Document, Types } from 'mongoose';

export interface UrlDocument extends Document {
  originalUrl: string;
  shortCode: string;
  user?: Types.ObjectId | string;
  createdAt: Date;
  clicks: number;
}

const UrlSchema: Schema<UrlDocument> = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
});

export const Url = mongoose.model<UrlDocument>('Url', UrlSchema);
