// src/controllers/inventory/inventory_controller.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Inventory } from '../../models/products/Inventory_model';
import { Product } from '../../models/products/Product_model';
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';

interface CreateInventoryBody {
    productId: string;
    initialStock: number;
}

interface InventoryQuery {
    page?: string;
    limit?: string;
}

interface GetInventoryByIdParams {
    id: string;
}

interface InventoryIdParams {
    id: string;
}

interface UpdateInventoryBody {
    initialStock?: number;
    productId?: string;
}

export const createInventory = async (
    req: Request<{}, {}, CreateInventoryBody>,
    res: Response
) => {
    try {
        const { productId, initialStock } = req.body;

        if (!productId || initialStock === undefined) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: ERROR_CODES.VALIDATION_ERROR.message,
                code: ERROR_CODES.VALIDATION_ERROR.code,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: 'Invalid productId',
                code: ERROR_CODES.VALIDATION_ERROR.code,
            });
        }

        if (typeof initialStock !== 'number' || initialStock < 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: 'initialStock must be a non-negative number',
                code: ERROR_CODES.VALIDATION_ERROR.code,
            });
        }


        const product = await Product.findById(productId).exec();
        if (!product) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
                code: ERROR_CODES.PRODUCT_NOT_FOUND.code,
            });
        }

        const existingInv = await Inventory.findOne({ product: productId }).exec();
        if (existingInv) {
            return res.status(STATUS_CODES.CONFLICT).json({
                message: 'Inventory already exists for this product',
                code: ERROR_CODES.DUPLICATE_INVENTORY.code,
            });
        }

        const newInv = new Inventory({
            product: productId,
            stock: initialStock,
            lastStockUpdate: new Date(),
        });

        const savedInv = await newInv.save();

        return res.status(STATUS_CODES.CREATED).json({
            message: 'Inventory created successfully',
            data: savedInv,
        });
    } catch (err) {
        console.error('Create Inventory Error:', err);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};


export const getAllInventory = async (
    req: Request<{}, {}, {}, InventoryQuery>,
    res: Response
) => {
    try {
        const { page = '1', limit = '10' } = req.query;

        const currentPage = parseInt(page, 10);
        const perPage = parseInt(limit, 10);

        if (isNaN(currentPage) || isNaN(perPage) || currentPage < 1 || perPage < 1) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: 'initialStock must be a non-negative number',
                code: ERROR_CODES.VALIDATION_ERROR.code,
            });
        }

        const totalItems = await Inventory.countDocuments();
        const inventory = await Inventory.find()
            .populate('product')
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            data: inventory,
            pagination: {
                currentPage,
                totalPages: Math.ceil(totalItems / perPage),
                totalItems,
            },
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};


export const getInventoryById = async (
    req: Request<GetInventoryByIdParams>,
    res: Response
) => {
    try {
        const { id } = req.params;

        const inventory = await Inventory.findById(id).populate('product');
        if (!inventory) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
                code: ERROR_CODES.PRODUCT_NOT_FOUND.code,
            });
        }

        return res.status(STATUS_CODES.OK).json({ success: true, data: inventory });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};


export const updateInventory = async (
    req: Request<InventoryIdParams, any, UpdateInventoryBody>,
    res: Response
) => {
    try {
        const { id } = req.params;

        const updatedInventory = await Inventory.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedInventory) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
                code: ERROR_CODES.PRODUCT_NOT_FOUND.code,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            data: updatedInventory,
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};

export const deleteInventory = async (
    req: Request<InventoryIdParams>,
    res: Response
) => {
    try {
        const { id } = req.params;

        const deletedInventory = await Inventory.findByIdAndDelete(id);

        if (!deletedInventory) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
                code: ERROR_CODES.PRODUCT_NOT_FOUND.code,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Inventory item deleted successfully',
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};

interface InventoryIdParams {
    id: string;
}

interface UpdateStockBody {
    quantity: number;
}

export const updateStock = async (
    req: Request<InventoryIdParams, any, UpdateStockBody>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const inventory = await Inventory.findById(id);

        if (!inventory) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.PRODUCT_NOT_FOUND.message,
                code: ERROR_CODES.PRODUCT_NOT_FOUND.code,
            });
        }

        if (inventory.stock - quantity < 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: 'Insufficient stock',
                code: 4001,
            });
        }

        inventory.stock -= quantity;
        inventory.lastStockUpdate = new Date();
        await inventory.save();

        return res.status(STATUS_CODES.OK).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};