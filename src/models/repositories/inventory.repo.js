"use strict";

import { convertToObjectIdMongodb } from "../../utils/index.js";
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

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
            inven_productId: convertToObjectIdMongodb(productId),
            inven_stock: { $gte: quantity },
        },
        updateSet = {
            $inc: {
                inven_stock: -quantity,
            },
            $push: {
                inven_reservations: {
                    quantity,
                    cartId,
                    createOn: new Date(),
                },
            },
        },
        options = {
            upsert: true,
            new: true,
        };

    return await _InventoryModel.updateOne(query, updateSet, options);
};

export { insertInventory, reservationInventory };
