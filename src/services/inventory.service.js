"use strict";

/*
    Nhiệm vụ của Inventory: Tạo những lo hàng nhập vào
*/

import _InventoryModel from "../models/inventory.model.js";
import { getProductById } from "../models/repositories/product.repo.js";
import { NotFoundError } from "../core/error.response.js";

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "1050/35/4, Quang Trung, Phuong 8, HCM City",
    }) {
        const product = await getProductById(productId);
        if (!product) throw new NotFoundError("Product not exists!!");

        const query = { inven_shopId: shopId, inven_productId: productId },
            updateSet = {
                $inc: {
                    inven_stock: stock,
                },
                $set: {
                    inven_location: location,
                },
            },
            options = { upsert: true, new: true };

        return await _InventoryModel.findOneAndUpdate(
            query,
            updateSet,
            options
        );
    }
}

export default InventoryService;
