import {
  createDoc,
  deleteDoc,
  updateDoc,
  getAllDoc,
  getSingleDoc,
  getDocsByField
} from '../factoryController.js';
import { Product } from '../../models/shop/productModel.js';
import { Category } from '../../models/shop/categoryModel.js';
import { errorHandler } from '../../middleware/errorHandler.js';
import { SUCCESS } from "../../utils/httpStatus.js";
import { uploadToCloudinary } from "../../middleware/multer.js";
import AppError from "../../utils/appError.js";


export const getAllProducts = getAllDoc(Product);

export const getSingleProduct = getSingleDoc(Product);

export const updateProduct = updateDoc(Product);

export const createProduct = errorHandler(
  async (req, res, next) => {
    const { title, description, category, totalStock, price, salePrice, discount, reviews, rateing, imageCover, images } = req.body;

    if (!req.files?.imageCover) {
      return next(new AppError("image cover required"));
    }

    const imageCoverUrl = await uploadToCloudinary(req.files.imageCover[0].path)
    console.log("imageCoverUrl", imageCoverUrl);
    let imagesUrls = [];

    if (req.files?.images) {
      imagesUrls = await Promise.all(
        req.files.images.map((file) => uploadToCloudinary(file.path))
      );
    }


    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return next(new AppError("Valid category ID is required", 400));
    }
    const product = await Product.create({
      title,
      description,
      category,
      totalStock,
      price,
      rateing,
      salePrice,
      reviews,
      discount,
      imageCover: imageCoverUrl,
      images: imagesUrls
    });

    await product.populate({
      path: "category",
      select: "name"
    });

    res.status(201).json({
      status: SUCCESS,
      data: { product }
    });
  }
)



export const deleteProduct = deleteDoc(Product);

export const getProductsByCategories = getDocsByField(Product, "category", Category, "_id", "slug");