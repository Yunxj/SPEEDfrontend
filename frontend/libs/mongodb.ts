import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yuyihai704:20030704aB@speed.cyoe5v8.mongodb.net/"
    );
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
