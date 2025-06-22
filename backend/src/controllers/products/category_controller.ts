import { Request, Response } from 'express';
import cloudinary from '../../config/cloudinary_config';
import { Category } from '../../models/products/Category_model';
import { Product } from '../../models/products/Product_model';
import { ERROR_CODES, STATUS_CODES } from '../../utils/error_codes';

interface CreateCategoryBody {
    name: string;
    description?: string;
    status?: 'active' | 'deactivated';
    isActive?: boolean;
}
interface UpdateCategoryBody {
    name?: string;
    description?: string;
    status?: 'active' | 'deactivated';
    isActive?: boolean;
}
interface ListCategoriesQuery {
    page?: string;
    limit?: string;
    active?: string;
}

export const createCategory = async (
    req: Request<{}, {}, CreateCategoryBody>,
    res: Response
) => {
    try {
        const { name, description, status, isActive } = req.body;

        if (!name) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                messsage: ERROR_CODES.VALIDATION_ERROR.message,
                code: ERROR_CODES.VALIDATION_ERROR.code
            });
        }

        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(STATUS_CODES.CONFLICT).json({
                messsage: ERROR_CODES.DUPLICATE_CATEGORY.message,
                code: ERROR_CODES.DUPLICATE_CATEGORY.code
            });
        }

        let imageUrl: string | undefined;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'grocery-categories',
                use_filename: true,
                unique_filename: false,
            });
            imageUrl = result.secure_url;
        }

        const newCategory = new Category({
            name,
            description,
            image: imageUrl,
            status: status || 'active',
            isActive: isActive || true,
        });

        const saved = await newCategory.save();
        return res.status(201).json({ message: 'Category created successfully', category: saved });
    } catch (error) {
        console.error('Create Category Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            messsage: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code
        });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
  
      return res.status(STATUS_CODES.OK).json({
        message: 'Categories fetched successfully',
        categories,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: ERROR_CODES.INTERNAL_ERROR.message,
        code: ERROR_CODES.INTERNAL_ERROR.code,
      });
    }
  };

export const updateCategory = async (
    req: Request<{ id: string }, {}, UpdateCategoryBody>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { name, description, status, isActive } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                messsage: ERROR_CODES.CATEGORY_NOT_FOUND.message,
                code: ERROR_CODES.CATEGORY_NOT_FOUND.code
            });
        }

        let imageUrl = category.image;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'grocery-categories',
                use_filename: true,
                unique_filename: false,
            });
            imageUrl = result.secure_url;
        }

        if (name !== undefined) category.name = name;
        if (description !== undefined) category.description = description;
        if (imageUrl !== undefined) category.image = imageUrl;
        if (status !== undefined) product.status = status as 'active' | 'deactivatd';
        if (typeof isActive === 'boolean') category.isActive = isActive;

        const updated = await category.save();
        return res.status(200).json({ message: 'Category updated successfully', category: updated });
    } catch (error) {
        console.error('Update Category Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            messsage: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code
        });
    }

};


export const getCategoryById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id){
            return res.status(STATUS_CODES.NOT_FOUND).json({
                messsage: ERROR_CODES.VALIDATION_ERROR.message,
                code: ERROR_CODES.VALIDATION_ERROR.code
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                messsage: ERROR_CODES.CATEGORY_NOT_FOUND.message,
                code: ERROR_CODES.CATEGORY_NOT_FOUND.code
            });
        }

        return res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error('Get Category by ID Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            messsage: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code
        });
    }
};


export const getActiveCategories = async (
    req: Request,
    res: Response
) => {
    try {
        const categories = await Category.find({ isActive: true }).sort('name');
        return res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Get Active Categories Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            messsage: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code
        });
    }
};

export const deleteCategory = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                messsage: ERROR_CODES.VALIDATION_ERROR.message,
                code: ERROR_CODES.VALIDATION_ERROR.code
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                messsage: ERROR_CODES.CATEGORY_NOT_FOUND.message,
                code: ERROR_CODES.CATEGORY_NOT_FOUND.code
            });

        }

        const linkedProducts = await Product.find({ category: category._id }).limit(1);
        if (linkedProducts.length > 0) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                messsage: ERROR_CODES.CATEGORY_NOT_FOUND.messsage,
                code: ERROR_CODES.CATEGORY_NOT_FOUND.code
            });
        }

        await category.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Delete Category Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            messsage: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code
        });
    }
};