import mongoose, { Schema } from "mongoose";

const pagerSchema = new Schema(
  {
    title: String,
    authors: String,
    journalName: String,
    yearOfPublication: String,
    volume: String,
    number: String,
    pages: String,
    DOI: String,
    approval: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Paper = mongoose.models.Paper || mongoose.model("Paper", pagerSchema);

export default Paper;
