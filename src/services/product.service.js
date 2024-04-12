"use strict";

import {
    _ProductModel,
    _ClothingModel,
    _ElectronicModel,
} from "../models/product.model.js";
import { BadRequestError } from "../core/error.response.js";

// define Factory class to create product
class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case "Clothing":
                return new Clothing(payload).createProduct();
            case "Electronics":
                return new Electronics(payload).createProduct();
            default:
                throw new BadRequestError("Invalid Product type: ", type);
        }
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
    async createProduct() {
        return await _ProductModel.create(this);
    }
}

// define sub-class for different product type Clothing
class Clothing extends Product {
    // Override the class Product method
    async createProduct() {
        // Create newClothing inherit properties product_attributes of class Product
        const newClothing = await _ClothingModel.create(
            this.product_attributes
        );
        if (!newClothing) {
            throw new BadRequestError("Create new Clothing error");
        }

        // Create newProduct of class Product
        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Create new Product error");
        }

        return newProduct;
    }
}

// define sub-class for different product type Electronics
class Electronics extends Product {
    // Override the class Product method
    async createProduct() {
        // Create newElectronic inherit properties product_attributes of class Product
        const newElectronic = await _ClothingModel.create(
            this.product_attributes
        );
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

export default ProductFactory;
