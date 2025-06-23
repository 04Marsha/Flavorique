const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (value) {
        const count = await this.constructor.countDocuments({ email: value });
        return count === 0;
      },
      message: "Email already exists",
    },
  },
  password: { type: String, required: true },
});


module.exports = mongoose.model("User", userSchema);
