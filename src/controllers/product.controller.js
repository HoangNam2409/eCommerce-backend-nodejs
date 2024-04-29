"use strict";

import ProductFactory from "../services/product.service.js";
import { SuccessResponse } from "../core/success.response.js";

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Product created successfully!",
            metadata: await ProductFactory.createProduct(
                req.body.product_type,
                { ...req.body, product_shop: req.user.userId }
            ),
        }).send(res);
    };

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Product published successfully",
            metadata: await ProductFactory.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Product unpublished successfully",
            metadata: await ProductFactory.unPublishProductForShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };

    // QUERY //
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Draft success",
            metadata: await ProductFactory.findAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all publish success",
            metadata: await ProductFactory.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list search products for user success",
            metadata: await ProductFactory.searchProducts(req.params),
        }).send(res);
    };

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Find all Products success",
            metadata: await ProductFactory.findAllProducts(req.query),
        }).send(res);
    };

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Find Product Success",
            metadata: await ProductFactory.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res);
    };
    // END QUERY //
}

const productController = new ProductController();

export default productController;
