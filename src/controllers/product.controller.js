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
}

const productController = new ProductController();

export default productController;
