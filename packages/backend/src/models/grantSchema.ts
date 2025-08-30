import mongoose, { Schema, Document } from 'mongoose';

export interface IGrant extends Document {
  userId: string;
  grantId: string;
  email?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GrantSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  grantId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export const Grant = mongoose.model<IGrant>('Grant', GrantSchema);
