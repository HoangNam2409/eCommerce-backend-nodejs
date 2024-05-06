"use strict";

import {
    _ProductModel,
    _ClothingModel,
    _ElectronicModel,
    _FurnitureModel,
} from "../models/product.model.js";
import { BadRequestError } from "../core/error.response.js";
import {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductForShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} from "../models/repositories/product.repo.js";
import {
    removeUndefinedObject,
    updateNestedObjectParser,
} from "../utils/index.js";

// define Factory class to create product
class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productType = ProductFactory.productRegistry[type];
        if (!productType) {
            throw new BadRequestError("Invalid product type: ", type);
        }

        return new productType(payload).createProduct();
    }

    // Update product
    static async updateProduct(type, productId, payload) {
        const productType = ProductFactory.productRegistry[type];
        if (!productType) {
            throw new BadRequestError("Invalid product type: ", type);
        }

        return new productType(payload).updateProduct(productId);
    }

    // Publish a product by a seller
    // PUT //
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductForShop({ product_shop, product_id }) {
        return await unPublishProductForShop({ product_shop, product_id });
    }
    // END PUT //

    // Get a list of the seller's draft (Lấy danh sách các sản phẩm nháp của người bán)
    // Query
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProducts({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ["product_name", "product_price", "product_thumb"],
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] });
    }
}

// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // Create new product
    async createProduct(product_id) {
        return await _ProductModel.create({
            ...this,
            _id: product_id,
        });
    }

    // Update product
    async updateProduct(productId, payload) {
        return await updateProductById({
            productId,
            payload,
            model: _ProductModel,
        });
    }
}

// define sub-class for different product type Clothing
class Clothing extends Product {
    // Override the class Product method
    async createProduct() {
        // Create newClothing inherit properties product_attributes of class Product
        const newClothing = await _ClothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) {
            throw new BadRequestError("Create new Clothing error");
        }

        // Create newProduct of class Product
        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError("Create new Product error");
        }

        return newProduct;
    }

    async updateProduct(productId) {
        // 1. Remove attr has null undefined
        const objectParams = removeUndefinedObject(this);
        // 2. Check xem update ở chỗ nào?
        if (objectParams.product_attributes) {
            // Update child
            await updateProductById({
                productId,
                payload: objectParams,
                model: _ClothingModel,
            });
        }

        const updateProduct = await super.updateProduct(
            productId,
            objectParams
        );

        return updateProduct;
    }
}

// define sub-class for different product type Electronics
class Electronics extends Product {
    // Override the class Product method
    async createProduct() {
        // Create newElectronic inherit properties product_attributes of class Product
        const newElectronic = await _ClothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) {
            throw new BadRequestError("Create new Electronics error");
        }

        // Create newProduct of class Product
        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Create new Product error");
        }

        return newProduct;
    }
}

// Define sub-class for different product type Furniture
class Furniture extends Product {
    // Override the class Product method
    async createProduct() {
        // Create newFurniture inherit properties product_attributes of class Product
        const newFurniture = await _FurnitureModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture) {
            throw new BadRequestError("Create new Furniture Error");
        }

        // Create newProduct of class Product
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) {
            throw new BadRequestError("Create new Product error");
        }

        return newProduct;
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                payload: objectParams.product_attributes,
                model: _FurnitureModel,
            });
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        );

        return updateProduct;
    }
}

// Register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);

export default ProductFactory;
