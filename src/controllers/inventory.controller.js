"use strict";

import InventoryService from "../services/inventory.service.js";
import { SuccessResponse } from "../core/success.response.js";

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Add Stock Success",
            metadata: await InventoryService.addStockToInventory(req.body),
        }).send(res);
    };
}

const inventoryController = new InventoryController();
export default inventoryController;
