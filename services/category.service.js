import Category from "../models/category.model.js";

export const createCategory = async (name) => {
  if (!name || name.trim().length < 3) {
    throw new Error("category.nameLength");
  }
  return await Category.create({ name });
};

export const getCategories = async () => {
  return await Category.find();
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new Error("category.notFound");
  }
  return category;
};

export const updateCategory = async (id, name) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true },
  );
  if (!category) {
    throw new Error("category.notFound");
  }
  return category;
};
