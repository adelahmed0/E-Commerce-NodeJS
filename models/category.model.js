const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Category = mongoose.model("Category", categorySchema);
