import mongoose from 'mongoose';

const mongoUri = process.env.DB_USERNAME && process.env.DB_PASSWORD ?
  `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:
    ${process.env.DB_PORT}/${process.env.DB_NAME}-${process.env.NODE_ENV}` :
  `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}-${process.env.NODE_ENV}`;

mongoose.connect(`mongodb://${mongoUri}`, {useNewUrlParser: true})
  .catch((e: any) => {
    throw e;
  });

export default mongoose;
