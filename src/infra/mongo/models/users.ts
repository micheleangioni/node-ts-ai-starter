import express from 'express';

export default function (app: express.Application) {
  const mongoose = app.get('mongooseClient');
  const {Schema} = mongoose;

  const users = new Schema({
    email: {type: String, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
  });

  return mongoose.model('users', users);
}
