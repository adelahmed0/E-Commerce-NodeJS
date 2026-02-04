import Product from "../models/product.model.js";

export const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  const savedProduct = await newProduct.save();
  return await savedProduct.populate("category");
};

export const getProducts = async ({
  search,
  categoryId,
  page = 1,
  perPage = 5,
}) => {
  const skip = (page - 1) * perPage;
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (categoryId) {
    filter.category = categoryId;
  }

  const products = await Product.find(filter)
    .populate("category")
    .skip(skip)
    .limit(perPage);

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / perPage);

  return {
    products,
    pagination: {
      total_count: totalProducts,
      current_page: page,
      last_page: totalPages,
      per_page: perPage,
    },
  };
};

export const getProductById = async (id, incrementViews = false) => {
  let query = Product.findById(id);
  if (incrementViews) {
    query = Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );
  }
  const product = await query.populate("category");
  if (!product) {
    throw new Error("product.notFound");
  }
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error("product.notFound");
  }
  return product;
};

export const updateProduct = async (
  id,
  updateData,
  isReplacement,
  uploadedImages,
) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("product.notFound");
  }

  if (uploadedImages && uploadedImages.length > 0) {
    if (isReplacement) {
      updateData.images = uploadedImages;
    } else {
      updateData.images = [...product.images, ...uploadedImages];
    }
  }

  // Remove undefined fields
  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key],
  );

  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("category");
};
