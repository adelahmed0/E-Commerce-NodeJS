import mongoose from "mongoose";

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
    // إعادة ترتيب الـ properties عشان id يكون الأول
    const { _id, id, ...rest } = ret;
    return { id, ...rest };
  },
});

export const Category = mongoose.model("Category", categorySchema);
