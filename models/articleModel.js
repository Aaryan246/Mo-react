const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    content: String,
    motive: String,
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("article", articleSchema);
