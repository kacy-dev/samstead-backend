import { Request, Response } from 'express';
import mongoose from 'mongoose';
import cloudinary from '../../config/cloudinary_config';
import { Product } from '../../models/products/Product_model';
import { Category } from '../../models/products/Category_model';
import { ERROR_CODES, STATUS_CODES } from '../../utils/error_codes';

const uploadToCloudinary = async (filePath: string) =>
  cloudinary.uploader.upload(filePath, { folder: 'grocery_products' });

interface Nutrition {
  calories?: string;
  protein?: string;
  carbohydrate?: string;
  vitaminC?: string;
}

interface AddProductBody {
  name: string;
  description: string;
  price: number | string;
  discountPrice?: number | string;
  stock: number | string;
  categoryId: string;
  nutrition?: Nutrition | string;
  isAvailable?: boolean;
}
interface GetProductsQuery {
  categoryId?: string;
  priceMin?: string;
  priceMax?: string;
  available?: string;
  topRated?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

interface SearchProductsQuery {
  keyword?: string;
  page?: string;
  limit?: string;
}

interface UpdateProductBody {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  stock?: number;
  categoryId?: string;
  nutrition?: string;
  isAvailable?: boolean;
}


export const addProduct = async (req: Request<{}, {}, AddProductBody>, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      nutrition,
      isAvailable,
    } = req.body;

    if (!name || !description || !price || !stock || !categoryId) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.VALIDATION_ERROR.message,
        code: ERROR_CODES.VALIDATION_ERROR.code
      });
    }

    if (!req.file) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.MISSING_FIELDS.message || "image file is required",
        code: ERROR_CODES.MISSING_FIELDS.code
      });
    }

    const categoryExists = await Category.findById(categoryId).exec();
    if (!categoryExists) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.CATEGORY_NOT_FOUND.message,
        code: ERROR_CODES.CATEGORY_NOT_FOUND.code
      });
    }

    const duplicate = await Product.findOne({ name, category: categoryId }).exec();
    if (duplicate) {
      return res.status(STATUS_CODES.CONFLICT).json({
        message: ERROR_CODES.DUPLICATE_PRODUCT.message,
        code: ERROR_CODES.DUPLICATE_PRODUCT.code
      });
    }

    const cloudRes = await uploadToCloudinary(req.file.path);

    let parsedNutrition: Nutrition | undefined;
    if (nutrition) {
      try {
        parsedNutrition = typeof nutrition === 'string' ? JSON.parse(nutrition) : nutrition;
        if (!Array.isArray(parsedNutrition)) {
          throw new Error("Nutrition must be an array");
        }
      } catch (err) {
        return res.status(400).json({
          message: "Invalid format for nutrition. Must be JSON stringified array of objects.",
          code: ERROR_CODES.VALIDATION_ERROR.code
        });
      }
    }

    const productData: Partial<IProduct> = {
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      category: categoryId,
      nutrition: parsedNutrition,
      image: cloudRes.secure_url,
      isAvailable: isAvailable || true,
      rating: 0,
      reviewsCount: 0,
    };

    const product = new Product(productData);

    const savedProduct = await product.save();

    return res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });

  }
};

export const getProducts = async (
  req: Request<{}, {}, {}, GetProductsQuery>,
  res: Response
) => {
  try {
    const {
      categoryId,
      priceMin,
      priceMax,
      available,
      topRated,
      page = '1',
      limit = '20',
      sort = '-createdAt',
    } = req.query;

    const filters: Record<string, any> = {};

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          message: ERROR_CODES.VALIDATION_ERROR.message,
          code: ERROR_CODES.VALIDATION_ERROR.code
        });
      }
      filters.category = categoryId;
    }

    if (available !== undefined) {
      filters.isAvailable = available === 'true';
    }

    if (priceMin || priceMax) {
      filters.price = {
        $gte: priceMin ? Number(priceMin) : 0,
        $lte: priceMax ? Number(priceMax) : Number.MAX_SAFE_INTEGER,
      };
    }

    if (topRated === 'true') {
      filters.rating = { $gte: 4 };
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 100); // limit max 100

    const totalItems = await Product.countDocuments(filters);

    const products = await Product.find(filters)
      .populate({ path: 'category', select: 'name image' })
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

export const getRelatedProducts = async (
  req: Request<{ productId: string }>,
  res: Response
) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.VALIDATION_ERROR.message,
        code: ERROR_CODES.VALIDATION_ERROR.code
      });
    }

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
        code: ERROR_CODES.PRODUCT_NOT_FOUND.code
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: currentProduct.category,
    })
      .limit(5)
      .select('-nutrition'); // exclude nutrition field to reduce payload

    return res.status(200).json({ success: true, data: relatedProducts });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

// Search products by keyword with pagination
export const searchProducts = async (
  req: Request<{}, {}, {}, SearchProductsQuery>,
  res: Response
) => {
  try {
    const { keyword, page = '1', limit = '5' } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.KEYWORD_REQUIRED.message,
        code: ERROR_CODES.KEYWORD_REQUIRED.code
      });
    }

    const filters = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    };

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 100);

    const totalItems = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
      },
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

// Get product by ID
export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.VALIDATION_ERROR.message,
        code: ERROR_CODES.VALIDATION_ERROR.code
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
        code: ERROR_CODES.PRODUCT_NOT_FOUND.code
      });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

// Update product by ID
export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductBody>,
  res: Response
) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      nutrition,
      isAvailable,
    } = req.body;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.VALIDATION_ERROR.message,
        code: ERROR_CODES.VALIDATION_ERROR.code
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
        code: ERROR_CODES.PRODUCT_NOT_FOUND.code
      });
    }

    // Handle image upload if file exists
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'grocery_products');
      product.image = result.secure_url;
    }

    // Update fields if provided, else keep existing values
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (categoryId !== undefined) product.category = categoryId;
    if (nutrition !== undefined) {
      try {
        product.nutrition = typeof nutrition === 'string' ? JSON.parse(nutrition) : nutrition;
      } catch {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid nutrition JSON format' });
      }
    }
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    const updatedProduct = await product.save();
    return res.status(STATUS_CODES.CREATED).json({ message: 'Product updated successfully.', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(errorCodes.VALIDATION_ERROR);
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(errorCodes.PRODUCT_NOT_FOUND);
    }

    if (product.image) {
      // Extract publicId from image url, e.g. https://res.cloudinary.com/.../grocery_products/abc123.jpg
      const publicId = product.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`grocery_products/${publicId}`);
      }
    }

    await product.deleteOne();

    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

// Toggle product active/inactive
export const toggleProductActive = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.VALIDATION_ERROR.message,
        code: ERROR_CODES.VALIDATION_ERROR.code
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
        code: ERROR_CODES.PRODUCT_NOT_FOUND.code
      });
    }

    product.isAvailable = !product.isAvailable;
    const updatedProduct = await product.save();

    return res.status(STATUS_CODES.OK).json({
      message: `Product has been ${product.isAvailable ? 'activated' : 'deactivated'}.`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error toggling product active status:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};