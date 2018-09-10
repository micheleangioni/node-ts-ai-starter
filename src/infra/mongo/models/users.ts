import express from 'express';

export default function (app: express.Application) {
  const mongoose = app.get('mongooseClient');
  const { Schema } = mongoose;

  const users = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
  });

  return mongoose.model('users', users);
}
