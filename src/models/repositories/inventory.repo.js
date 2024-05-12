"use strict";

import _InventoryModel from "../inventory.model.js";

const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = "unKnow",
}) => {
    return await _InventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location,
    });
};

export { insertInventory };
