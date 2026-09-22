const mongoose = require("mongoose");
const user_exampleSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  profile: {type: String, required: false},
},
  {timestamps: true}
);
module.exports = mongoose.model("user_example", user_exampleSchema);