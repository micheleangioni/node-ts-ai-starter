import express from 'express';
import usersSchema from './users/usersSchema';

export default function (app: express.Application) {
  // Init models
  usersSchema(app.get('sqlClient'));
}
