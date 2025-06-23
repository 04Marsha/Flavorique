const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  recipeName: { type: String, required: true },
  yourName: { type: String, required: true },
  recipe: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
