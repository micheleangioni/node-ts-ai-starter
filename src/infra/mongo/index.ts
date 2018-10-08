import mongoose from 'mongoose';

mongoose.connect(
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:
    ${process.env.DB_PORT}/${process.env.DB_NAME}-${process.env.NODE_ENV}`, {useNewUrlParser: true})
  .catch((e: any) => {
    throw e;
  });

export default mongoose;
