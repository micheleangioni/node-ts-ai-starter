import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : `mongodb://localhost:27017/node-ts-ai-starter_${process.env.NODE_ENV || ''}`;

mongoose.connect(mongoUri, {})
  .catch((e: any) => {
    throw e;
  });

export default mongoose;
