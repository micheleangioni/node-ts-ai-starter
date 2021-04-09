import mongoose from 'mongoose';

export default (mongooseClient: typeof mongoose) => {
  const { Schema } = mongooseClient;

  return new Schema({
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    username: { sparse: true, type: String, unique: true },
  }, { timestamps: true });
};
