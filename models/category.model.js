import mongoose from "mongoose";
import { toJSONPlugin } from "../helpers/mongoosePlugins.js";

const categorySchema = new mongoose.Schema({
  name: String,
});

// Apply toJSON plugin
categorySchema.plugin(toJSONPlugin);

const Category = mongoose.model("Category", categorySchema);

export default Category;
