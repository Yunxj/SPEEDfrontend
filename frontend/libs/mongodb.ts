import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://asejoy:cn7kwo6wdxJD7OUt@cluster0.bax92wf.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
