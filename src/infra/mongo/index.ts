import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : `mongodb://localhost:27017/node-ts-starter_${process.env.NODE_ENV}`;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((e: any) => {
    throw e;
  });

export default mongoose;
